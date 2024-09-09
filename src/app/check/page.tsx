"use client";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

function Page() {
  const [box, setBox] = useState([
    { id: 0, bg: "red" },
    { id: 1, bg: "blue" },
  ]);
  function handleOnDrag(result: DropResult) {}

  return (
    <div className="w-screen h-screen">
      <DragDropContext onDragEnd={handleOnDrag}>
        <Droppable droppableId="boxes">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {box.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <div className={`w-80 h-32 bg-${item.bg}-600`}></div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Page;
