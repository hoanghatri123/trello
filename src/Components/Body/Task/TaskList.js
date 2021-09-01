import React, { useRef, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import './task.css';
import TaskItem from './TaskItem';

function TaskList({ list, index, addTask, deleteList }) {
    const [inputAddTask, setInputAddTask] = useState('');
    const inputAddTaskRef = useRef(null);

    const handleInputChange = (e) => {
        setInputAddTask(e.target.value);
    }

    const handleAddTask = (e) => {
        e.preventDefault();

        const newInputAddTask = inputAddTask.trim();
        if (newInputAddTask !== '') {
            addTask(inputAddTask.trim(), list.id);
            setInputAddTask('');
        }
        else {
            alert('Tiêu đề phải chứa kí tự!');
            setInputAddTask('');
            inputAddTaskRef.current.focus();
        }
    }

    const handleDeleteList = () => {
        deleteList(list.id);
    }

    return (
        <Draggable draggableId={list.id} index={index}>
            {provided => (
                <div className='list' ref={provided.innerRef} {...provided.draggableProps}>
                    <div className='list__heading' {...provided.dragHandleProps}>
                        <h3 {...provided.dragHandleProps}>{list.title}</h3>
                        <i className='fa fa-trash' onClick={handleDeleteList} />
                    </div>
                    <Droppable droppableId={list.id}>
                        {provided => (
                            <ul className='item__wrap' {...provided.droppableProps} ref={provided.innerRef}>
                                {list.tasks.map((task, index) => {
                                    return (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            list={list}
                                            index={index}
                                        />
                                    )
                                })
                                }
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                    <form className='add__item' onSubmit={handleAddTask}>
                        <input
                            className='add__item--input'
                            ref={inputAddTaskRef}
                            value={inputAddTask}
                            onChange={handleInputChange}
                            type='text'
                            placeholder='Thêm tiêu đề...'
                        />
                        <button className='add__item--btn' type='submit' disabled={!inputAddTask}>
                            <i className="fa fa-plus"></i>
                            Thêm thẻ
                        </button>
                    </form>
                </div>
            )}
        </Draggable>
    )
}


export default TaskList