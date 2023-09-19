import { FC } from "react";
import { withWrapper } from "~/utils";
import { EditorCtx, useEditorCtx } from "./context";

const Editor = withWrapper(EditorCtx, () => {
  const ctx = useEditorCtx();

  console.log(ctx.layer.value.map(v => v.length))

  return (
    <div className="p-2 h-full">
      <div className="rounded-md border p-2 h-full grid grid-cols-3 gap-2">
        <main className="p-2 rounded-md border col-span-2 flex flex-col gap-2">
          <menu className="p-2 rounded-md border">
            Menu
          </menu>
          <div className="p-2 rounded-md border flex-grow">
            Map

            <div className="grid" style={{
              gridTemplateRows: `repeat(${ctx.layer.value.length + 2}, 2rem)`,
              gridTemplateColumns: `repeat(${(ctx.layer.value[0]?.length ?? 0) + 2}, 2rem`,
            }}>
              <ul className="contents">
                {new Array(ctx.layer.dimensions.columns + 2).fill(null).map((_, i) =>
                  <li key={i} className="bg-red-50" onClick={() => ctx.layer.expand('top')} />
                )}
              </ul>

              {ctx.layer.value.map((row, i) => (
                <ul key={JSON.stringify(row) + i} className="contents">
                  <li className="bg-red-50" onClick={() => ctx.layer.expand('left')} />

                  {row.map((column, i) => (
                    <li key={JSON.stringify(column) + i} className="border">
                      {JSON.stringify(column)}
                    </li>
                  ))}

                  <li className="bg-red-50" onClick={() => ctx.layer.expand('right')} />
                </ul>
              ))}

              <ul className="contents">
                {new Array(ctx.layer.dimensions.columns + 2).fill(null).map((_, i) =>
                  <li key={i} className="bg-red-50" onClick={() => ctx.layer.expand('bottom')} />
                )}
              </ul>
            </div>
          </div>
        </main>

        <TileMapSelector />
      </div>
    </div>
  );
})

export default Editor;

const TileMapSelector: FC = () => {
  const { selectedTile, tileMaps } = useEditorCtx();

  return (
    <section className="p-2 rounded-md border">
      <h1>Tilemap selector</h1>
      <hr/>

      Tilemaps: {tileMaps.value.length}
    </section>
  )
}
