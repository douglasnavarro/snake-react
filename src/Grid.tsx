import React from 'react'
import './Grid.css'

const ROWS = 12
const COLS = 12

type SnakePart = {
  row: number
  col: number
}

type SnakeDirection = 'right' | 'left' | 'up' | 'down'

type UseSnake = {
  snake: Array<SnakePart>
  move: () => void
}

const useSnake = (): UseSnake => {
  const [direction, _] = React.useState<SnakeDirection>('down')
  const [snake, setSnake] = React.useState([
    { row: 1, col: 1 },
    { row: 1, col: 0 },
  ])

  const moveHead = ({ row, col }: SnakePart, direction: SnakeDirection) => {
    switch (direction) {
      case 'right':
        return { row, col: col + 1 }
      case 'down':
        return { row: row + 1, col }
      case 'left':
        return { row, col: col - 1 }
      case 'up':
        return { row: row - 1, col }
    }
  }

  const addPart = (row: number, col: number) =>
    setSnake((currentSnake) => [...currentSnake, { row, col }])

  const move: UseSnake['move'] = () =>
    setSnake((currentSnake) =>
      currentSnake.map((part, i) => {
        return i == 0
          ? moveHead(part, direction)
          : { row: currentSnake[i - 1].row, col: currentSnake[i - 1].col }
      })
    )

  return { snake, move }
}

const Grid: React.FC = () => {
  const { snake, move } = useSnake()

  const grid = Array.from({ length: ROWS }, (_, rowIndex) =>
    Array.from({ length: COLS }, (_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
    }))
  )

  return (
    <div className="grid">
      {grid.flat().map((cell, index) => {
        const isHead = snake[0].row === cell.row && snake[0].col === cell.col
        const isBody =
          snake.some(
            (part) => part.row === cell.row && part.col === cell.col
          ) && !isHead

        return (
          <div
            key={index}
            className="grid-cell"
            style={{
              gridRow: cell.row + 1,
              gridColumn: cell.col + 1,
              backgroundColor: isHead ? 'red' : isBody ? 'green' : 'lightgray',
            }}
          >
            <span className="cell-id">
              ({cell.row}, {cell.col})
            </span>
          </div>
        )
      })}
      <button onClick={move}>Move</button>
    </div>
  )
}

export default Grid
