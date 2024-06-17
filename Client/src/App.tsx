import viteLogo from '/fintrack.jpg'
import './App.css'

function App() {
  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </div>
      <h1>Wellcome to <b style={{ color: "#476EE2" }}>FinTrack</b></h1>
      <div className="card">
        <p>
          A comprehensive app for tracking expenses, managing income, setting budgets,<br />
          and achieving savings goals with real-time insights and secure, user-friendly features.
        </p>
      </div>
      <p className="read-the-docs">
        Comming soon...
      </p>
    </>
  )
}

export default App
