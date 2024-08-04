import React from 'react'
import './Grid.css'

const ROWS = 12
const COLS = 12

type SnakePart = {
  row: number
  col: number
}

type UseSnake = {
  snake: Array<SnakePart>
  move: () => void
}

const useSnake = (): UseSnake => {
  const [snake, setSnake] = React.useState([{ row: 1, col: 1 }])

  const addPart = (row: number, col: number) =>
    setSnake((currentSnake) => [...currentSnake, { row, col }])

  const move: UseSnake['move'] = () =>
    setSnake((currentSnake) =>
      currentSnake.map(({ row, col }) => ({ row, col: col + 1 }))
    )

  return { snake, move }
}

const Grid: React.FC = () => {
  // These have to match the CSS; Something to generalize later.

  const { snake, move } = useSnake()

  const grid = Array.from({ length: ROWS }, (_, rowIndex) =>
    Array.from({ length: COLS }, (_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
    }))
  )

  return (
    <div className="grid">
      {grid.flat().map((cell, index) => (
        <div
          key={index}
          className="grid-cell"
          style={{
            gridRow: cell.row + 1,
            gridColumn: cell.col + 1,
            backgroundColor:
              snake[0].col == cell.col && snake[0].row == cell.row
                ? 'red'
                : 'lightgray',
          }}
        >
          <span className="cell-id">
            ({cell.row}, {cell.col})
          </span>
        </div>
      ))}
      <button onClick={move}>Move</button>
    </div>
  )
}

export default Grid
