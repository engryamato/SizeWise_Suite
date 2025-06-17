export { default } from './ui';

          <label htmlFor="velocity" className="block text-sm font-medium text-gray-700 mb-1">
            Velocity (FPM)
          </label>
          <input
            type="number"
            id="velocity"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter velocity in FPM"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="button"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate Duct Size
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirDuctSizer;
