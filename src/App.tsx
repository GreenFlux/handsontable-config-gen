import { useState, useEffect } from 'react'
import { HotTable } from '@handsontable/react-wrapper'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
import './App.css'
import OpenAI from 'openai'

registerAllModules()

const MOCKOON_ENDPOINTS = [
  { name: 'Companies', path: '/companies', description: 'Fake companies with industry, location, employees' },
  { name: 'Contacts', path: '/contacts', description: 'Fake contacts with name, email, phone, address' },
  { name: 'Customers', path: '/customers', description: 'Fake customers with personal and contact info' },
  { name: 'Movies', path: '/movies', description: 'Fake movies with title, genre, director, rating' },
  { name: 'Photos', path: '/photos', description: 'Fake photos with URLs, captions, likes' },
  { name: 'Posts', path: '/posts', description: 'Fake blog posts with title, author, content' },
  { name: 'Sales', path: '/sales', description: 'Fake sales data with country, item type, costs' },
  { name: 'Users', path: '/users', description: 'Fake users with name, email, phone, address' },
  { name: 'Todos', path: '/todos', description: 'Fake todos with title, status, priority' },
]

// OpenAI client will be created dynamically with the current API key

// Custom renderers
const imageRenderer = (_instance: any, td: any, _row: any, _col: any, _prop: any, value: any, _cellProperties: any) => {
  if (value && typeof value === 'string' && value.startsWith('http')) {
    // Fix HTML entities in URLs (e.g., &amp; to &)
    const cleanUrl = value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    
    // More comprehensive image URL detection
    const isImageUrl = cleanUrl.includes('.jpg') || 
                      cleanUrl.includes('.png') || 
                      cleanUrl.includes('.jpeg') || 
                      cleanUrl.includes('.gif') || 
                      cleanUrl.includes('.webp') || 
                      cleanUrl.includes('.svg') ||
                      cleanUrl.includes('picsum') || 
                      cleanUrl.includes('loremflickr') ||
                      cleanUrl.includes('avatars.githubusercontent.com') ||
                      cleanUrl.includes('avatar') ||
                      cleanUrl.includes('profile') ||
                      cleanUrl.includes('image')
    
    if (isImageUrl) {
      td.innerHTML = `
        <div class="image-cell" style="position: relative; min-height: 50px; cursor: pointer;" 
             onclick="this.classList.toggle('show-url');">
          <img 
            src="${cleanUrl}" 
            style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; display: block;" 
            onerror="this.style.display='none'; this.nextElementSibling.style.display='inline'; this.parentElement.style.backgroundColor='rgba(248, 113, 113, 0.1)';" 
            onload="this.parentElement.style.backgroundColor=''; this.nextElementSibling.style.display='none';"
            loading="lazy"
            title="Click to toggle URL display"
          />
          <span style="display:none; font-size: 10px; color: #f87171; padding: 4px;">✗ Failed to load image</span>
          <div class="url-text" style="
            position: absolute; 
            top: 0; left: 0; right: 0; bottom: 0; 
            background: rgba(26, 26, 37, 0.95); 
            color: #9359cb; 
            font-size: 10px; 
            padding: 4px; 
            border-radius: 4px; 
            display: none; 
            align-items: center; 
            justify-content: center;
            text-align: center;
            word-break: break-all;
            line-height: 1.2;
          ">${cleanUrl}</div>
          <style>
            .image-cell.show-url .url-text { display: flex !important; }
            .image-cell:hover { opacity: 0.8; }
          </style>
        </div>`
    } else {
      td.textContent = cleanUrl
    }
  } else {
    td.textContent = value || ''
  }
  return td
}

const currencyRenderer = (_instance: any, td: any, _row: any, _col: any, _prop: any, value: any, _cellProperties: any) => {
  const numValue = parseFloat(value)
  if (!isNaN(numValue)) {
    td.textContent = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numValue)
    td.style.textAlign = 'right'
    td.style.fontFamily = 'monospace'
  } else {
    td.textContent = value || ''
  }
  return td
}

const linkRenderer = (_instance: any, td: any, _row: any, _col: any, _prop: any, value: any, _cellProperties: any) => {
  if (value && typeof value === 'string' && value.startsWith('http')) {
    td.innerHTML = `<a href="${value}" target="_blank" rel="noopener noreferrer" style="color: #64b5f6; text-decoration: none;">${value.length > 30 ? value.substring(0, 30) + '...' : value}</a>`
  } else {
    td.textContent = value || ''
  }
  return td
}

const percentageRenderer = (_instance: any, td: any, _row: any, _col: any, _prop: any, value: any, _cellProperties: any) => {
  const numValue = parseFloat(value)
  if (!isNaN(numValue)) {
    td.textContent = `${(numValue * 100).toFixed(1)}%`
    td.style.textAlign = 'right'
  } else {
    td.textContent = value || ''
  }
  return td
}

const thousandsRenderer = (_instance: any, td: any, _row: any, _col: any, _prop: any, value: any, _cellProperties: any) => {
  const numValue = parseFloat(value)
  if (!isNaN(numValue)) {
    td.textContent = new Intl.NumberFormat('en-US').format(numValue)
    td.style.textAlign = 'right'
    td.style.fontFamily = 'monospace'
  } else {
    td.textContent = value || ''
  }
  return td
}

function App() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/companies')
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [configGenerating, setConfigGenerating] = useState<boolean>(false)
  const [generatedConfig, setGeneratedConfig] = useState<string>('')
  const [generatedCSS, setGeneratedCSS] = useState<string>('')
  const [activeConfigTab, setActiveConfigTab] = useState<'config' | 'css'>('config')
  const [customPrompt, setCustomPrompt] = useState<string>('')
  const [dataSource, setDataSource] = useState<'api' | 'upload' | 'paste'>('api')
  const [jsonInput, setJsonInput] = useState<string>('')
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY || ''
  })
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey)
    localStorage.setItem('openai_api_key', newKey)
  }

  const handleHeaderMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const createOpenAIClient = () => {
    if (!apiKey.trim()) {
      throw new Error('OpenAI API key is required. Please add your API key in the settings.')
    }
    return new OpenAI({
      apiKey: apiKey.trim(),
      dangerouslyAllowBrowser: true
    })
  }

  const fetchData = async (endpoint: string) => {
    setLoading(true)
    setCustomPrompt('') // Clear prompt when loading new data
    try {
      const response = await fetch(`https://playground.mockoon.com${endpoint}`)
      const result = await response.json()
      const limitedData = result.slice(0, 20) // Limit to 20 rows for demo
      setData(limitedData)
      await generateConfig(limitedData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
      setColumns([])
    } finally {
      setLoading(false)
    }
  }

  const analyzeDataForEnums = (data: any[], field: string) => {
    const values = data.map(item => item[field]).filter(val => val != null)
    const uniqueValues = [...new Set(values)]
    const isLikelyEnum = uniqueValues.length <= Math.min(10, data.length * 0.5) && uniqueValues.length > 1
    return { isLikelyEnum, uniqueValues: isLikelyEnum ? uniqueValues : [] }
  }

  const injectCustomCSS = (cssString: string) => {
    let styleEl = document.getElementById('handsontable-custom-styles')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'handsontable-custom-styles'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = cssString
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            processCustomData(jsonData)
          } else {
            alert('Please upload a JSON file containing an array of objects')
          }
        } catch (_error) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    } else {
      alert('Please upload a JSON file')
    }
  }

  const handleJsonPaste = () => {
    try {
      const jsonData = JSON.parse(jsonInput)
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        processCustomData(jsonData)
      } else {
        alert('Please enter a valid JSON array of objects')
      }
    } catch (_error) {
      alert('Invalid JSON format')
    }
  }

  const processCustomData = async (jsonData: any[]) => {
    setLoading(true)
    setCustomPrompt('') // Clear prompt when loading new data
    try {
      const limitedData = jsonData.slice(0, 50) // Limit for performance
      setData(limitedData)
      await generateConfig(limitedData)
    } catch (error) {
      console.error('Error processing custom data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateConfig = async (sampleData: any[]) => {
    if (!sampleData.length) return

    setConfigGenerating(true)
    try {
      const openai = createOpenAIClient()
      const sampleRecord = sampleData[0]
      const dataPreview = sampleData.slice(0, 5)
      
      // Analyze all data for enum detection
      const fieldAnalysis = Object.keys(sampleRecord).map(field => {
        const analysis = analyzeDataForEnums(sampleData, field)
        return { field, ...analysis }
      })
      
      const prompt = `
Analyze this data and generate both Handsontable column configuration AND CSS styling. Return as JSON object with 'config' and 'css' properties.

Sample data (${sampleData.length} total records):
${JSON.stringify(dataPreview, null, 2)}

Field analysis for enum detection:
${fieldAnalysis.map(f => `${f.field}: ${f.isLikelyEnum ? 'ENUM with values ' + JSON.stringify(f.uniqueValues) : 'NOT ENUM'}`).join('\n')}

Create column config objects with:
- data: field name (exact match)
- title: human-readable title
- type: 'text'|'numeric'|'date'|'checkbox'|'dropdown' 
- width: optimized based on content type
- className: CSS class name for custom styling (when needed)
- renderer: ONLY use custom renderers for special cases

CRITICAL WIDTH RULES:
- ID fields (id, uuid, _id, userId, etc.): EXACTLY 100px width
- Short codes/enums: 80-120px
- Names/titles: 150-200px
- Long content: 250-300px
- Images: 80px (just for thumbnail)

IMPORTANT RULES:
1. IMAGE URLS (containing 'picsum', 'loremflickr', 'avatar', 'github', or ending in image extensions): Use "imageRenderer", width 80
2. CURRENCY/PRICE fields (cost, price, amount, salary, revenue, etc.): Use "currencyRenderer", width 120
3. PERCENTAGE fields (0-1 decimals, rate, percent): Use "percentageRenderer", width 100
4. THOUSANDS SEPARATOR (large numbers, counts, quantities): Use "thousandsRenderer", width 120
5. REGULAR URLS (http links): Use "linkRenderer", width 200
6. EMAIL fields: Use type "text", width 180
7. BOOLEAN fields (true/false, is_*, has_*): Use type "checkbox", width 80
8. ENUM fields (limited unique values): Use type "dropdown" with "source" array, width 120
9. ID FIELDS (id, uuid, _id, *Id, *_id): Use type "numeric", width EXACTLY 100
10. DATES (ISO format, *_at, *Date): Use type "date", width 130
11. LONG TEXT (description, content, body, text): Use type "text", width 250-300

STYLING CAPABILITIES:
- Generate CSS classes for any styling requests
- Use className property in column config to apply styles
- Create appropriate CSS selectors for Handsontable cells using: .table-container .htCore td.your-class-name
- IMPORTANT: Always use !important to override Handsontable's default styles

AVAILABLE CSS VARIABLES (use these for consistent theming):
- --brand-primary: #9359cb (purple)
- --brand-secondary: #b085db (light purple)
- --text-primary: #e0e0ff (white text)
- --text-secondary: #a0a0cc (gray text)
- --bg-secondary: #1a1a25 (dark background)
- --bg-tertiary: #25253a (darker background)

STYLING EXAMPLES:
  * Bold text: .table-container .htCore td.bold-column { font-weight: bold !important; }
  * Purple text: .table-container .htCore td.purple-text { color: var(--brand-primary) !important; }
  * Centered text: .table-container .htCore td.centered { text-align: center !important; }
  * Bold centered purple: .table-container .htCore td.purple-bold-center { color: var(--brand-primary) !important; font-weight: bold !important; text-align: center !important; }
  * Purple background: .table-container .htCore td.purple-bg { background: rgba(147, 89, 203, 0.15) !important; }
  * Status styling: .table-container .htCore td.status-active { background: #d4edda !important; color: #155724 !important; }
  * Custom fonts: .table-container .htCore td.mono-text { font-family: 'JetBrains Mono', monospace !important; }

Return format:
{
  "config": [
    {"data": "id", "title": "ID", "type": "numeric", "width": 100},
    {"data": "name", "title": "Name", "type": "text", "width": 150, "className": "bold-name"},
    {"data": "count", "title": "Count", "type": "numeric", "width": 120, "renderer": "thousandsRenderer"},
    {"data": "status", "title": "Status", "type": "dropdown", "source": ["active", "inactive"], "width": 120, "className": "status-styling"}
  ],
  "css": "/* Generated CSS for column styling */\n.table-container .htCore td.bold-name { font-weight: bold !important; color: var(--brand-primary) !important; }\n.table-container .htCore td.status-styling { background: rgba(147, 89, 203, 0.15) !important; }"
}

${customPrompt ? `\nADDITIONAL USER REQUEST: ${customPrompt}` : ''}

Return ONLY the JSON object, no explanation or markdown.`

      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4',
        temperature: 0.1
      })

      const responseText = completion.choices[0]?.message?.content?.trim()
      
      if (responseText) {
        try {
          const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
          const parsedResponse = JSON.parse(cleanedResponse)
          
          // Check if response has config and css properties
          if (parsedResponse.config && Array.isArray(parsedResponse.config)) {
            const configArray = parsedResponse.config
            const cssString = parsedResponse.css || ''
            
            // Store the generated content
            setGeneratedConfig(JSON.stringify(configArray, null, 2))
            setGeneratedCSS(cssString)
            
            // Inject CSS into document
            if (cssString) {
              injectCustomCSS(cssString)
            }
            
            // Apply custom renderers to config
            const finalConfig = configArray.map((col: any) => {
              const newCol = { ...col }
              if (col.renderer === 'imageRenderer') {
                newCol.renderer = imageRenderer
              } else if (col.renderer === 'currencyRenderer') {
                newCol.renderer = currencyRenderer
              } else if (col.renderer === 'linkRenderer') {
                newCol.renderer = linkRenderer
              } else if (col.renderer === 'percentageRenderer') {
                newCol.renderer = percentageRenderer
              } else if (col.renderer === 'thousandsRenderer') {
                newCol.renderer = thousandsRenderer
              } else if (col.renderer && typeof col.renderer === 'string') {
                // Remove unknown renderer references to prevent crashes
                delete newCol.renderer
              }
              return newCol
            })
            
            setColumns(finalConfig)
            
            // Clear custom prompt after successful generation
            setCustomPrompt('')
          } else {
            // Fallback: try to parse as array (old format)
            const configArray = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]
            setGeneratedConfig(JSON.stringify(configArray, null, 2))
            setGeneratedCSS('')
            
            const finalConfig = configArray.map((col: any) => {
              const newCol = { ...col }
              if (col.renderer === 'imageRenderer') {
                newCol.renderer = imageRenderer
              } else if (col.renderer === 'currencyRenderer') {
                newCol.renderer = currencyRenderer
              } else if (col.renderer === 'linkRenderer') {
                newCol.renderer = linkRenderer
              } else if (col.renderer === 'percentageRenderer') {
                newCol.renderer = percentageRenderer
              } else if (col.renderer === 'thousandsRenderer') {
                newCol.renderer = thousandsRenderer
              } else if (col.renderer && typeof col.renderer === 'string') {
                // Remove unknown renderer references to prevent crashes
                delete newCol.renderer
              }
              return newCol
            })
            
            setColumns(finalConfig)
            setCustomPrompt('')
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError)
          generateFallbackConfig(sampleRecord)
        }
      }
    } catch (error) {
      console.error('Error generating config:', error)
      if (error instanceof Error && error.message.includes('OpenAI API key')) {
        alert('OpenAI API key is required. Please add your API key in the settings above.')
        setShowSettings(true)
      } else {
        alert('Failed to generate configuration. Using fallback.')
      }
      generateFallbackConfig(sampleData[0])
    } finally {
      setConfigGenerating(false)
    }
  }

  const generateFallbackConfig = (sampleRecord: any) => {
    const basicColumns = Object.keys(sampleRecord).map(key => ({
      data: key,
      title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      type: 'text',
      width: 120
    }))
    setColumns(basicColumns)
    setGeneratedConfig(JSON.stringify(basicColumns, null, 2))
  }

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(generatedConfig)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy config:', err)
    }
  }

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generatedCSS)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy CSS:', err)
    }
  }

  useEffect(() => {
    if (dataSource === 'api') {
      fetchData(selectedEndpoint)
    }
  }, [selectedEndpoint, dataSource])

  return (
    <div className="app">
      <header className="app-header" onMouseMove={handleHeaderMouseMove}>
        <h1 
          className="header-title-with-effect"
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`
          } as React.CSSProperties}
        >
          Handsontable Config Generator
        </h1>
        <p>AI Powered table config based on your data</p>
        <div className="header-buttons">
          <button 
            className="settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Add your OpenAI API Key"
          >
            Add your OpenAI API Key
          </button>
          <a 
            href="https://handsontable.com/docs/javascript-data-grid/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="handsontable-docs-btn"
          >
            Handsontable Docs
          </a>
        </div>
      </header>

      {showSettings && (
        <div className="settings-section">
          <div className="settings-content">
            <div className="setting-item">
              <label htmlFor="api-key-input">OpenAI API Key:</label>
              <div className="api-key-input-group">
                <input
                  id="api-key-input"
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="sk-proj-... (Enter your OpenAI API key)"
                  className="api-key-input"
                />
                <span className="api-key-status">
                  {apiKey.trim() ? '✓' : '⚠️'}
                </span>
              </div>
              <p className="setting-description">
                Your API key is stored locally and never sent to our servers. 
                Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="data-input-section">
        <div className="data-source-tabs">
          <button 
            className={`tab ${dataSource === 'api' ? 'active' : ''}`}
            onClick={() => {
              setDataSource('api')
              setCustomPrompt('')
            }}
          >
            Mock API
          </button>
          <button 
            className={`tab ${dataSource === 'upload' ? 'active' : ''}`}
            onClick={() => {
              setDataSource('upload')
              setCustomPrompt('')
            }}
          >
            Upload JSON
          </button>
          <button 
            className={`tab ${dataSource === 'paste' ? 'active' : ''}`}
            onClick={() => {
              setDataSource('paste')
              setCustomPrompt('')
            }}
          >
            Paste Data
          </button>
        </div>

        {dataSource === 'api' && (
          <div className="api-controls">
            <label htmlFor="endpoint-select">Choose API Endpoint:</label>
            <select 
              id="endpoint-select"
              value={selectedEndpoint} 
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              disabled={loading || configGenerating}
            >
              {MOCKOON_ENDPOINTS.map(endpoint => (
                <option key={endpoint.path} value={endpoint.path}>
                  {endpoint.name} - {endpoint.description}
                </option>
              ))}
            </select>
            <p className="mockoon-attribution">
              Mock data provided by <a href="https://www.mockoon.com" target="_blank" rel="noopener noreferrer">Mockoon</a>
            </p>
          </div>
        )}

        {dataSource === 'upload' && (
          <div className="upload-controls">
            <label htmlFor="file-upload">Upload JSON File:</label>
            <input 
              id="file-upload"
              type="file" 
              accept=".json"
              onChange={handleFileUpload}
              disabled={loading || configGenerating}
            />
          </div>
        )}

        {dataSource === 'paste' && (
          <div className="paste-controls">
            <label htmlFor="json-input">Paste JSON Data:</label>
            <div className="paste-input-group">
              <textarea 
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]'
                disabled={loading || configGenerating}
              />
              <button 
                onClick={handleJsonPaste}
                disabled={loading || configGenerating || !jsonInput.trim()}
                className="process-btn"
              >
                Process Data
              </button>
            </div>
          </div>
        )}

        <div className="status">
          {loading && <span className="loading">⟳ Loading data...</span>}
          {configGenerating && <span className="generating">⚡ AI generating config...</span>}
          {!loading && !configGenerating && data.length > 0 && (
            <span className="ready">✓ Ready - {data.length} records loaded</span>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="table-container">
          {data.length > 0 && columns.length > 0 && (
            <HotTable
              data={data}
              columns={columns}
              colHeaders={true}
              rowHeaders={true}
              height="500"
              width="100%"
              licenseKey="non-commercial-and-evaluation"
              stretchH="all"
              autoWrapRow={true}
              autoWrapCol={true}
              manualColumnResize={true}
              manualRowResize={true}
              contextMenu={true}
              filters={true}
              dropdownMenu={true}
              multiColumnSorting={true}
              className="htDark"
            />
          )}
        </div>

        <div className="config-panel">
          <div className="prompt-input-section">
            <label htmlFor="custom-prompt">Prompt (optional):</label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Make name column bold, highlight status with green background..."
              className="custom-prompt-input"
              rows={4}
            />
            {data.length > 0 && (
              <button 
                onClick={() => generateConfig(data)}
                disabled={configGenerating}
                className="regenerate-btn"
              >
                {configGenerating ? '⚡ Generating...' : '⟳ Regenerate Config'}
              </button>
            )}
          </div>
          
          <div className="config-tabs">
            <button 
              className={`config-tab ${activeConfigTab === 'config' ? 'active' : ''}`}
              onClick={() => setActiveConfigTab('config')}
            >
              Config
            </button>
            <button 
              className={`config-tab ${activeConfigTab === 'css' ? 'active' : ''}`}
              onClick={() => setActiveConfigTab('css')}
            >
              CSS
            </button>
          </div>

          <div className="tab-content">
            {activeConfigTab === 'config' && (
              <>
                <div className="config-header">
                  <h3>Handsontable Configuration</h3>
                  <button 
                    className="copy-config-btn"
                    onClick={copyConfig}
                    title="Copy configuration to clipboard"
                  >
                    ⧉ Copy Config
                  </button>
                </div>
                <pre className="config-content">
                  <code>{generatedConfig || '// Configuration will appear here after data loads...'}</code>
                </pre>
              </>
            )}
            
            {activeConfigTab === 'css' && (
              <>
                <div className="config-header">
                  <h3>Generated CSS Styles</h3>
                  <button 
                    className="copy-css-btn"
                    onClick={copyCSS}
                    title="Copy CSS to clipboard"
                    disabled={!generatedCSS}
                  >
                    ⧉ Copy CSS
                  </button>
                </div>
                <pre className="config-content">
                  <code>{generatedCSS || '/* CSS styles will appear here when styling is applied */\n/* Try adding styling requests in the prompt above */\n/* Example: "Make name column bold and highlight status" */'}</code>
                </pre>
              </>
            )}
          </div>
        </div>
      </div>

      {!loading && !configGenerating && data.length === 0 && (
        <div className="no-data">
          <p>No data available. Please select an endpoint.</p>
        </div>
      )}

      <footer className="app-footer">
        <p>
          Made by <a href="https://www.greenflux.us" target="_blank" rel="noopener noreferrer">GreenFlux</a>
        </p>
      </footer>
    </div>
  )
}

export default App
