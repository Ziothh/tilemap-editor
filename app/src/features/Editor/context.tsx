import { useState } from "react";
import { contextFactory } from "~/utils";
import { useArray, useStateObject } from "~/utils/hooks";

interface Tile { 
  /** Tilemap URI */
  uri: string, 
  x: number, 
  y: number 
}

export const [useEditorCtx, EditorCtx] = contextFactory(() => {
  /** An array of tile map URIs */
  const tileMaps = useArray<string>();

  const layer = useMapLayer();

  const selectedTile = useStateObject<Tile | null>(null);



  return {
    layer,
    tileMaps,
    selectedTile,
  };
});


type LayerSquare = { tile: Tile }

const DEFAULT_LAYER_DIMENSIONS = { x: 10, y: 10 };

const useMapLayer = () => {
  const [layer, setLayer] = useState<
    Array<
      | null
      | LayerSquare
    >[]
  >(
    new Array(DEFAULT_LAYER_DIMENSIONS.y)
      .fill(null)
      .map(() => new Array(DEFAULT_LAYER_DIMENSIONS.x).fill(null))
  )

  const self = {
    value: layer,
    dimensions: {
      columns: layer[0]?.length ?? 0,
      rows: layer.length,
    },

    set(x: number, y: number, value: LayerSquare | null) {
      setLayer(prev => prev.map(
        (row, yIndex) => y === yIndex
          ? row.map((column, xIndex) => x === xIndex ? value : column)
          : row
      ));

      return self;
    },
    expand(direction: 'top' | 'right' | 'bottom' | 'left') {
      switch (direction) {
        case 'top':
          return setLayer(prev => [new Array(self.dimensions.columns).fill(null), ...prev]);
        case 'bottom':
          return setLayer(prev => [...prev, new Array(self.dimensions.columns).fill(null)]);
        case 'left':
          return setLayer(prev => prev.map(columns => [null, ...columns]));
        case 'right':
          return setLayer(prev => prev.map(columns => [...columns, null]));
        default:
          direction satisfies never;
          throw new Error(`Expanding in direction "${direction}" is not supported.`)
      }
    }
  } as const;

  return self;
}
