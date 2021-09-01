import React, { useContext, useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './task.css';
import Context from 'utils/context';


function TaskItem({ list, task, index }) {
    const { updateInputEdit, toggleEdit } = useContext(Context);
    const inputTaskRef = useRef(null);

    const enter = (e) => {
        if (e.key === 'Enter') return handleEditTask();
    }

    const handleInputChange = (e) => {
        if (e.target.value.trim() !== '') {
            inputTaskRef.current.style.border = '2px solid #0079bf';
        }
        else inputTaskRef.current.style.border = '2px solid red';
        updateInputEdit(e.target.value, task.id, list.id)
    }

    const handleEditTask = () => {
        if (task.content.trim() !== '') {
            toggleEdit(list.id, task.id, task.content)
        }
        else {
            inputTaskRef.current.focus();
        }
    }

    return (
        <Draggable draggableId={task.id} index={index}>
            {provided => (
                <li
                    className='item'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onDoubleClick={handleEditTask}>
                    {
                        task.edit
                            ? <input
                                className='input__edit-task'
                                ref={inputTaskRef}
                                value={task.content}
                                onChange={handleInputChange}
                                onKeyPress={enter}
                                onBlur={handleEditTask}
                                autoFocus
                            />
                            : <>{task.content}</>
                    }
                </li>
            )}
        </Draggable>
    )
}

export default TaskItem