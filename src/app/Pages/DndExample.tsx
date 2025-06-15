'use client';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '20px',
    margin: '12px 0',
    borderRadius: '12px',
    border: '1px solid #3a3a3a',
    backgroundColor: isDragging ? '#2d2d2d' : '#1f1f1f',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
    color: '#f0f0f0',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'grab',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.id}
    </div>
  );
}

export default function DndExample() {
  const [items, setItems] = useState(['العنصر 1', 'العنصر 2', 'العنصر 3', 'العنصر 4']);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '60px auto', 
      backgroundColor: '#121212', 
      padding: '30px', 
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
    }}>
      <h2 style={{ 
        color: '#ffffff', 
        marginBottom: '25px', 
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        مثال على السحب والإفلات في Next.js باستخدام dnd-kit
      </h2>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
