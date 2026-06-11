import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_SECURE_RECOMMENDATIONS = gql`
  query GetSecureRecommendations($preferences: [String!], $healthConditions: [String!]) {
    getSecureRecommendations(preferences: $preferences, healthConditions: $healthConditions) {
      id
      title
      ingredients
      cookingTime
      tags
      safetyAnalysis {
        safetyScore
        riskLevel
        allergensDetected
        medicalWarnings
        aiExplanation
      }
    }
  }
`;

interface RecipeData {
  id: string;
  title: string;
  ingredients: string[];
  cookingTime: number;
  tags: string[];
  safetyAnalysis?: {
    safetyScore: number;
    riskLevel: string;
    medicalWarnings: string[];
    aiExplanation: string;
  };
}

interface SecureRecommendationsData {
  getSecureRecommendations: RecipeData[];
}

function App() {
  const [selectedPref, setSelectedPref] = useState<string>('Dessert');
  const [selectedHealth, setSelectedHealth] = useState<string>('Diabetes');
  const [channelId, setChannelId] = useState<string>('CH-982314-MED');

  const { loading, error, data, refetch } = useQuery<SecureRecommendationsData>(GET_SECURE_RECOMMENDATIONS, {
    variables: {
      preferences: selectedPref ? [selectedPref] : [],
      healthConditions: selectedHealth ? [selectedHealth] : [],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  // Print clinical reports for doctors
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Top Navbar */}
      <nav className="navbar-brand">
        <h1>📊 TrustRec Platform for Health IoT Analytics</h1>
        <div className="navbar-links">
          <span>Channels</span>
          <span>Apps</span>
          <span>Support</span>
          <span style={{ fontWeight: 'bold' }}>👤 Patient_Minh_2026</span>
        </div>
      </nav>

      {/* BANNER */}
      <section className="system-workflow-banner">
        <div className="workflow-card">
          <span style={{ fontSize: '1.2rem' }}>📥</span>
          <div>
            <h3>Collect Layer</h3>
            <p>Ingesting patient medical profiles</p>
          </div>
        </div>
        <div className="workflow-card">
          <span style={{ fontSize: '1.2rem' }}>⚙️</span>
          <div>
            <h3>Analyze Layer</h3>
            <p>GraphQL & Embedded LLM execution</p>
          </div>
        </div>
        <div className="workflow-card">
          <span style={{ fontSize: '1.2rem' }}>🚀</span>
          <div>
            <h3>Act Layer</h3>
            <p>Deploying safe clinical guardrails</p>
          </div>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="main-layout-grid">
        
        {/* Sidebar left */}
        <aside className="sidebar-panel">
          <h3>Channel Settings</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Data Channel ID:</label>
              <input type="text" value={channelId} onChange={(e) => setChannelId(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Field 1 (Dietary Vector):</label>
              <select value={selectedPref} onChange={(e) => setSelectedPref(e.target.value)}>
                <option value="Keto">Keto (High Fat, Low Carb)</option>
                <option value="Dessert">Dessert / Sweet Menu</option>
                <option value="Vegetarian">Vegetarian</option>
              </select>
            </div>

            <div className="form-group">
              <label>Field 2 (Medical Constraints):</label>
              <select value={selectedHealth} onChange={(e) => setSelectedHealth(e.target.value)}>
                <option value="Diabetes">Diabetes (Diyabet)</option>
                <option value="Hypertension">Hypertension (Hipertansiyon)</option>
                <option value="Nut Allergy">Nut Allergy (Findik Alerjisi)</option>
                <option value="None">None (Unrestricted)</option>
              </select>
            </div>

            <button type="submit" className="btn-analyze">Execute Data Query</button>
          </form>

          {/* Technical Configuration Card for API Endpoint */}
          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#666' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#2c3e50' }}>🌐 Gateway Metadata:</div>
            <div><strong>Protocol:</strong> GraphQL over HTTP</div>
            <div><strong>Endpoint:</strong> 4000/graphql</div>
            <div><strong>Status:</strong> {loading ? '🔄 Fetching' : '🟢 Connected'}</div>
          </div>
        </aside>

        {/* Dashboard analysis on the right */}
        <main className="analytics-container">
          
          {loading && <p style={{ padding: '10px', color: '#1b6ca8' }}>⏳ Resolving GraphQL Pipeline Dependencies...</p>}
          {error && <p style={{ padding: '10px', color: 'red' }}>❌ Connection Failure: {error.message}</p>}

          {data && data.getSecureRecommendations.map((recipe: RecipeData) => {
            const isHighRisk = recipe.safetyAnalysis?.riskLevel === 'HIGH';
            const statusColor = isHighRisk ? '#e74c3c' : recipe.safetyAnalysis?.riskLevel === 'MEDIUM' ? '#f39c12' : '#2ecc71';

            return (
              <div key={recipe.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div className="data-channel-box">
                  
                  {/* Title with NEW ACTION BAR */}
                  <div className="channel-header">
                    <h2>Channel View: {recipe.title}</h2>
                    <div className="channel-actions-toolbar">
                      <button className="btn-secondary-action" onClick={handlePrintReport}>🖨️ Print Report</button>
                      <button className="btn-secondary-action" onClick={() => alert('Metadata exported to CSV!')}>📥 Export CSV</button>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="metrics-row">
                    <div className="metric-cell">
                      <div className="metric-val" style={{ color: statusColor }}>{recipe.safetyAnalysis?.safetyScore || 'N/A'}/10</div>
                      <div className="metric-label">Field 3: Safety Score</div>
                    </div>
                    <div className="metric-cell">
                      <div className="metric-val" style={{ color: statusColor, fontSize: '1.2rem', paddingTop: '5px' }}>
                        {recipe.safetyAnalysis?.riskLevel || 'UNKNOWN'}
                      </div>
                      <div className="metric-label">Field 4: Risk Evaluation</div>
                    </div>
                    <div className="metric-cell">
                      <div className="metric-val">{recipe.cookingTime}m</div>
                      <div className="metric-label">Field 5: Process Time</div>
                    </div>
                    <div className="metric-cell">
                      <div className="metric-val" style={{ fontSize: '1.1rem', paddingTop: '5px' }}>
                        {recipe.id === '1' ? '520 kcal' : '380 kcal'}
                      </div>
                      <div className="metric-label">Field 6: Energy Index</div>
                    </div>
                  </div>

                  {/* Matrix Table */}
                  <div className="system-logs-section">
                    <h4>Technical Analysis Matrix</h4>
                    <table className="log-entry-table">
                      <thead>
                        <tr>
                          <th style={{ width: '25%' }}>Parameter Stream</th>
                          <th>Resolved Diagnostic Logs</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Ingredients Array</strong></td>
                          <td>{recipe.ingredients.join(', ')}</td>
                        </tr>
                        <tr>
                          <td><strong>Tags Registry</strong></td>
                          <td>{recipe.tags.map(t => `#${t}`).join(' ')}</td>
                        </tr>
                        {recipe.safetyAnalysis && (
                          <>
                            <tr>
                              <td><span className="status-badge" style={{ backgroundColor: statusColor }}>Counter-Indications</span></td>
                              <td style={{ color: isHighRisk ? '#e74c3c' : '#744210', fontWeight: 'bold' }}>
                                {recipe.safetyAnalysis.medicalWarnings.join(' | ')}
                              </td>
                            </tr>
                            <tr>
                              <td><strong>LLM Guardrail Interpretation</strong></td>
                              <td className="ai-quote-box">{recipe.safetyAnalysis.aiExplanation}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>

                    {/* Box for displaying Raw JSON for research and packet inspection */}
                    <div className="json-inspector-box">
                      <div className="json-header">
                        <span>📡 Live GraphQL Response Payload (JSON)</span>
                        <span style={{ color: '#666' }}>ID: {recipe.id}</span>
                      </div>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify({ recipe: { id: recipe.id, title: recipe.title, safetyAnalysis: recipe.safetyAnalysis } }, null, 2)}
                      </pre>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </main>

      </div>
    </div>
  );
}

export default App;