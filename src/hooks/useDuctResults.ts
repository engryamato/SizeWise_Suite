import { useState, useCallback } from 'react';
import { DuctResults, ResultItem, ResultsSummary } from '@/types/ductResults';
import { processDuctResults } from '@/utils/ductResults';
import { findDuctGauge } from '@/utils/smacnaUtils';
import { findDuctJointTypes } from '@/utils/smacnaJointUtils';
import { findDuctSeamTypes } from '@/utils/smacnaSeamUtils';
import { findDuctHangerSpacing } from '@/utils/smacnaHangerUtils';

type UseDuctResultsProps = {
  initialResults?: Partial<DuctResults>;
};

export function useDuctResults({ initialResults = {} }: UseDuctResultsProps = {}) {
  const [results, setResults] = useState<{
    data: ResultItem[];
    summary: ResultsSummary;
    loading: boolean;
    error: string | undefined;
  }>({
    data: [],
    summary: {
      status: 'info',
      message: 'Enter duct parameters to see results',
      issues: [],
      timestamp: new Date(),
    },
    loading: false,
    error: null,
  });

  const calculateResults = useCallback(
    async (input: Partial<DuctResults>) => {
      try {
        setResults(prev => ({ ...prev, loading: true, error: null }));

        // Default values
        const defaults: DuctResults = {
          ductId: 'default-duct',
          ductName: 'Untitled Duct',
          shape: 'round',
          dimensions: {},
          airflow: 0,
          velocity: 0,
          maxVelocity: 0,
          pressureDrop: 0,
          pressureClass: 2, // Default to 2" WG
          materialGauge: 0,
          minRequiredGauge: 0,
          transverseJoints: [],
          seamTypes: [],
          hangerSpacing: 0,
          maxHangerSpacing: 0,
          timestamp: new Date(),
          units: {
            length: 'in',
            velocity: 'fpm',
            pressure: 'in_wg',
            airflow: 'cfm',
          },
          ...initialResults,
          ...input,
        };

        // Calculate derived values if not provided
        const derived: Partial<DuctResults> = { ...defaults };

        // Find gauge if not provided
        if (!derived.materialGauge && derived.dimensions) {
          if (derived.shape === 'round' && 'diameter' in derived.dimensions) {
            const gaugeResult = findDuctGauge(
              { diameter: derived.dimensions.diameter || 0 },
              derived.shape,
              derived.pressureClass
            );
            derived.materialGauge = gaugeResult.gauge;
            derived.minRequiredGauge = gaugeResult.gauge;
          } else if (
            derived.shape === 'rectangular' &&
            'width' in derived.dimensions &&
            'height' in derived.dimensions
          ) {
            const gaugeResult = findDuctGauge(
              {
                width: derived.dimensions.width || 0,
                height: derived.dimensions.height || 0,
              },
              derived.shape,
              derived.pressureClass
            );
            derived.materialGauge = gaugeResult.gauge;
            derived.minRequiredGauge = gaugeResult.gauge;
          }
        }

        // Find joint types if not provided
        if (derived.dimensions) {
          if (derived.shape === 'round' && 'diameter' in derived.dimensions) {
            const jointResult = findDuctJointTypes(
              { diameter: derived.dimensions.diameter || 0 },
              derived.shape,
              derived.pressureClass
            );
            derived.transverseJoints = jointResult.jointTypes;
          } else if (
            derived.shape === 'rectangular' &&
            'width' in derived.dimensions &&
            'height' in derived.dimensions
          ) {
            const jointResult = findDuctJointTypes(
              {
                width: derived.dimensions.width || 0,
                height: derived.dimensions.height || 0,
              },
              derived.shape,
              derived.pressureClass
            );
            derived.transverseJoints = jointResult.jointTypes;
          }
        }

        // Find seam types if not provided
        if (derived.dimensions) {
          if (derived.shape === 'round' && 'diameter' in derived.dimensions) {
            const seamResult = findDuctSeamTypes(
              { diameter: derived.dimensions.diameter || 0 },
              derived.shape,
              derived.pressureClass
            );
            derived.seamTypes = seamResult.seamTypes;
          } else if (
            derived.shape === 'rectangular' &&
            'width' in derived.dimensions &&
            'height' in derived.dimensions
          ) {
            const seamResult = findDuctSeamTypes(
              {
                width: derived.dimensions.width || 0,
                height: derived.dimensions.height || 0,
              },
              derived.shape,
              derived.pressureClass
            );
            derived.seamTypes = seamResult.seamTypes;
          }
        }

        // Find hanger spacing if not provided
        if (derived.dimensions && derived.materialGauge) {
          if (derived.shape === 'round' && 'diameter' in derived.dimensions) {
            const hangerResult = findDuctHangerSpacing(
              { diameter: derived.dimensions.diameter || 0 },
              derived.materialGauge,
              derived.shape
            );
            derived.maxHangerSpacing = hangerResult.maxSpacingFt;
          } else if (
            derived.shape === 'rectangular' &&
            'width' in derived.dimensions &&
            'height' in derived.dimensions
          ) {
            const hangerResult = findDuctHangerSpacing(
              {
                width: derived.dimensions.width || 0,
                height: derived.dimensions.height || 0,
              },
              derived.materialGauge,
              derived.shape
            );
            derived.maxHangerSpacing = hangerResult.maxSpacingFt;
          }
        }

        // Process results
        const { results: processedResults, summary } = processDuctResults(derived as DuctResults);

        setResults({
          data: processedResults,
          summary,
          loading: false,
          error: null,
        });

        return { results: processedResults, summary };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        const errorState = {
          data: [],
          summary: {
            status: 'error' as const,
            message: 'Error calculating results',
            issues: [errorMessage],
            timestamp: new Date(),
          },
          loading: false,
          error: errorMessage,
        };
        setResults(errorState);
        return { results: [], summary: errorState.summary };
      }
    },
    [initialResults]
  );

  return {
    ...results,
    calculateResults,
    resetResults: () =>
      setResults({
        data: [],
        summary: {
          status: 'info',
          message: 'Enter duct parameters to see results',
          issues: [],
          timestamp: new Date(),
        },
        loading: false,
        error: null,
      }),
  };
}
