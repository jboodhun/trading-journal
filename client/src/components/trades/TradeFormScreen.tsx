import { Link } from 'react-router-dom'
import { TradeForm } from './trade-form'

interface TradeFormScreenProps {
  cancelTo: string
}

/**
 * The full-page trade form layout. Works with any TradeForm provider
 * (CreateTradeProvider or EditTradeProvider) wrapped around it.
 */
export function TradeFormScreen({ cancelTo }: TradeFormScreenProps) {
  return (
    <div className="trade-page-grid">
      <div className="card">
        <TradeForm.Frame>
          <TradeForm.ErrorNote />

          <div className="form-section">
            <div className="form-section-title">Position</div>
            <div className="form-grid">
              <TradeForm.Symbol />
              <TradeForm.Direction />
              <TradeForm.Quantity />
              <TradeForm.Fees />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Execution</div>
            <div className="form-grid">
              <TradeForm.EntryPrice />
              <TradeForm.ExitPrice />
              <TradeForm.EntryTime />
              <TradeForm.ExitTime />
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title">Context</div>
            <div className="form-grid">
              <TradeForm.Setup />
              <TradeForm.Notes />
            </div>
          </div>

          <div className="form-actions">
            <Link to={cancelTo} className="btn btn-ghost">
              Cancel
            </Link>
            <TradeForm.Submit />
          </div>
        </TradeForm.Frame>
      </div>

      <TradeForm.Summary />
    </div>
  )
}
