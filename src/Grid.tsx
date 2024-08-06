import React, { useEffect, useState } from 'react'
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
  direction: SnakeDirection
  move: () => void
  grow: () => void
  setDirection: (newDirection: SnakeDirection) => void
}

const useSnake = (): UseSnake => {
  const [direction, setDirection] = useState<SnakeDirection>('right')
  const [snake, setSnake] = useState([
    { row: 1, col: 1 },
    { row: 1, col: 0 },
  ])

  const moveHead = (
    { row, col }: SnakePart,
    direction: SnakeDirection
  ): SnakePart => {
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

  const addPart = (snake: Array<SnakePart>, direction: SnakeDirection) => {
    const lastPart = snake[snake.length - 1]
    let newPart: SnakePart
    switch (direction) {
      case 'right':
        newPart = { row: lastPart.row, col: lastPart.col - 1 }
        break
      case 'down':
        newPart = { row: lastPart.row - 1, col: lastPart.col }
        break
      case 'left':
        newPart = { row: lastPart.row, col: lastPart.col + 1 }
        break
      case 'up':
        newPart = { row: lastPart.row + 1, col: lastPart.col }
        break
    }
    return [...snake, newPart]
  }

  const move: UseSnake['move'] = () =>
    setSnake((currentSnake) =>
      currentSnake.map((part, i) => {
        return i === 0
          ? moveHead(part, direction)
          : { row: currentSnake[i - 1].row, col: currentSnake[i - 1].col }
      })
    )

  const grow: UseSnake['grow'] = () => {
    setSnake((currentSnake) => addPart(currentSnake, direction))
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'w') setDirection('up')
    else if (e.key === 'd') setDirection('right')
    else if (e.key === 'a') setDirection('left')
    else if (e.key === 's') setDirection('down')
  }

  return {
    snake,
    direction,
    setDirection,
    move,
    grow,
  }
}

const useGame = (
  snake: Array<SnakePart>,
  reward: { row: number; col: number },
  resetReward: () => void,
  growSnake: () => void,
  moveSnake: () => void
) => {
  const [score, setScore] = useState<number>(0)

  useEffect(() => {
    const i = setInterval(moveSnake, 100)
    return () => clearInterval(i)
  })

  useEffect(() => {
    if (snake[0].row === reward.row && snake[0].col === reward.col) {
      setScore((currentScore) => currentScore + 1)
      resetReward()
      growSnake()
    }
  }, [snake, reward, growSnake, resetReward])

  return { score }
}

const Grid: React.FC = () => {
  const { snake, direction, move, grow, setDirection } = useSnake()

  const [reward, setReward] = useState<{ row: number; col: number }>({
    row: 3,
    col: 3,
  })

  const { score } = useGame(
    snake,
    reward,
    () =>
      setReward({
        row: Math.floor(Math.random() * ROWS),
        col: Math.floor(Math.random() * COLS),
      }),
    grow,
    move
  )

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
        const isReward = cell.row === reward.row && cell.col === reward.col

        return (
          <div
            key={index}
            className="grid-cell"
            style={{
              gridRow: cell.row + 1,
              gridColumn: cell.col + 1,
              backgroundColor: isReward
                ? 'orange'
                : isHead
                ? 'red'
                : isBody
                ? 'green'
                : 'lightgray',
            }}
          >
            {/* <span className="cell-id">
              ({cell.row}, {cell.col})
            </span> */}
          </div>
        )
      })}
      <button onClick={move}>Move</button>
      <button onClick={grow}>Grow</button>
      <button onClick={() => setDirection('down')}>Change direction</button>
      <span>Direction: {direction}</span>
      <span>Score: {score}</span>
    </div>
  )
}

export default Grid
