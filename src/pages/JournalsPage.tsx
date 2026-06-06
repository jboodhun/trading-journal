import { trades } from 'data/journal'
import { Badge, Button, Card } from 'components/ui'

function resultTone(result: string) {
  if (result === 'Win') {
    return 'green'
  }

  if (result === 'Loss') {
    return 'red'
  }

  return 'slate'
}

export function JournalsPage() {
  return (
    <div className="page-stack">
      <header className="section-header">
        <div>
          <h1>Journals</h1>
          <p>Static trade log for the Q1 demo journal.</p>
        </div>
        <Button>+ Add Trade</Button>
      </header>

      <section className="journal-summary">
        <Card.Root>
          <p className="summary-label">Total Trades</p>
          <strong>100</strong>
        </Card.Root>
        <Card.Root>
          <p className="summary-label">Best Setup</p>
          <strong>Opening Range</strong>
        </Card.Root>
        <Card.Root>
          <p className="summary-label">Average R:R</p>
          <strong>1.74</strong>
        </Card.Root>
      </section>

      <Card.Root className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Trade</th>
                <th>Date</th>
                <th>Symbol</th>
                <th>Setup</th>
                <th>Side</th>
                <th>Result</th>
                <th>P&L</th>
                <th>R:R</th>
                <th>Emotion</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td>{trade.id}</td>
                  <td>{trade.date}</td>
                  <td>{trade.symbol}</td>
                  <td>{trade.setup}</td>
                  <td>{trade.side}</td>
                  <td>
                    <Badge tone={resultTone(trade.result)}>{trade.result}</Badge>
                  </td>
                  <td className={trade.pnl >= 0 ? 'pnl-positive' : 'pnl-negative'}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td>{trade.riskReward.toFixed(1)}</td>
                  <td>{trade.emotion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Root>
    </div>
  )
}
