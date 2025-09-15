"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CalculatorWidget() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  return (
    <div className="space-y-2">
      <div className="bg-black/30 p-2 rounded text-right text-lg font-mono">{display}</div>

      <div className="grid grid-cols-4 gap-1">
        <Button onClick={clear} variant="outline" size="sm" className="text-xs">
          C
        </Button>
        <Button onClick={() => inputOperation("÷")} variant="outline" size="sm" className="text-xs">
          ÷
        </Button>
        <Button onClick={() => inputOperation("×")} variant="outline" size="sm" className="text-xs">
          ×
        </Button>
        <Button onClick={() => inputOperation("-")} variant="outline" size="sm" className="text-xs">
          -
        </Button>

        <Button onClick={() => inputNumber("7")} variant="outline" size="sm" className="text-xs">
          7
        </Button>
        <Button onClick={() => inputNumber("8")} variant="outline" size="sm" className="text-xs">
          8
        </Button>
        <Button onClick={() => inputNumber("9")} variant="outline" size="sm" className="text-xs">
          9
        </Button>
        <Button onClick={() => inputOperation("+")} variant="outline" size="sm" className="text-xs row-span-2">
          +
        </Button>

        <Button onClick={() => inputNumber("4")} variant="outline" size="sm" className="text-xs">
          4
        </Button>
        <Button onClick={() => inputNumber("5")} variant="outline" size="sm" className="text-xs">
          5
        </Button>
        <Button onClick={() => inputNumber("6")} variant="outline" size="sm" className="text-xs">
          6
        </Button>

        <Button onClick={() => inputNumber("1")} variant="outline" size="sm" className="text-xs">
          1
        </Button>
        <Button onClick={() => inputNumber("2")} variant="outline" size="sm" className="text-xs">
          2
        </Button>
        <Button onClick={() => inputNumber("3")} variant="outline" size="sm" className="text-xs">
          3
        </Button>
        <Button onClick={performCalculation} variant="outline" size="sm" className="text-xs row-span-2">
          =
        </Button>

        <Button onClick={() => inputNumber("0")} variant="outline" size="sm" className="text-xs col-span-2">
          0
        </Button>
        <Button onClick={() => inputNumber(".")} variant="outline" size="sm" className="text-xs">
          .
        </Button>
      </div>
    </div>
  )
}
