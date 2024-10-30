import React from "react";

function Test() {
  return (
    <div>
      {/*
        This component uses @tailwindcss/forms
      
        yarn add @tailwindcss/forms
        npm install @tailwindcss/forms
      
        plugins: [require('@tailwindcss/forms')]
      
        @layer components {
          .no-spinner {
            -moz-appearance: textfield;
          }
      
          .no-spinner::-webkit-outer-spin-button,
          .no-spinner::-webkit-inner-spin-button {
            margin: 0;
            -webkit-appearance: none;
          }
        }
      */}

      <div>
        <label htmlFor="Quantity" className="sr-only">
          {" "}
          Quantity{" "}
        </label>

        <div className="flex items-center rounded border border-gray-200">
          <button
            type="button"
            className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
          >
            &minus;
          </button>

          <input
            type="number"
            id="Quantity"
            value="1"
            className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          />

          <button
            type="button"
            className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
          >
            &plus;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Test;
