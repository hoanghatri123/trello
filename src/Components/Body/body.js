import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './body.css';
import { v4 } from 'uuid';
import TaskList from './Task/TaskList';

import Context from 'utils/context';


function Body() {
    const TRELLO_STORAGE_KEY = 'TRELLO_APP';

    const [lists, setLists] = useState({ datas: {}, dataIds: [] });
    const [inputAddList, setinputAddList] = useState('');
    const inputAddListRef = useRef(null);

    // const API = 'http://localhost:3000/trello'

    // useEffect(() => {
    //     fetch(API)
    //         .then(res => res.json())
    //         .then(data => {
    //             setLists(data)
    //         })
    // }, [])

    useEffect(() => {
        const storagedTrello = localStorage.getItem(TRELLO_STORAGE_KEY);
        if (storagedTrello) {
            setLists(JSON.parse(storagedTrello))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(TRELLO_STORAGE_KEY, JSON.stringify(lists))
    }, [lists])

    const handleInputChange = (e) => {
        setinputAddList(e.target.value)
    }

    const addList = (e) => {
        e.preventDefault();

        const newInputAddList = inputAddList.trim();
        if (newInputAddList !== '') {
            const newListId = v4();
            const newList = {
                id: newListId,
                title: inputAddList,
                tasks: []
            }

            setLists({
                datas: {
                    ...lists.datas,
                    [newListId]: newList
                },
                dataIds: [...lists.dataIds, newListId]
            })

            setinputAddList('');
            inputAddListRef.current.focus();
        }
        else {
            alert('Danh sách phải chứa kí tự!');
            setinputAddList('');
            inputAddListRef.current.focus();
        }
    }

    const addTask = (nameTask, listId) => {
        const newTask = { id: v4(), content: nameTask, edit: false }
        const list = lists.datas[listId];

        list.tasks = [...list.tasks, newTask];

        setLists({
            ...lists,
            datas: { ...lists.datas, [list.id]: list }
        })
    }

    const toggleEdit = (listId, taskId, taskContent) => {
        const list = lists.datas[listId];
        list.tasks = list.tasks.map(task => {
            if (task.id == taskId) return { id: taskId, content: taskContent, edit: !task.edit }
            else return task
        })

        setLists({
            ...lists,
            datas: { ...lists.datas, [list.id]: list }
        })
    }

    const updateInputEdit = (value, taskId, listId) => {
        const list = lists.datas[listId];
        list.tasks = list.tasks.map(task => {
            if (task.id == taskId) return { id: taskId, content: value, edit: true }
            else return task
        })

        setLists({
            ...lists,
            datas: { ...lists.datas, [list.id]: list }
        })
    }

    const deleteList = (listId) => {
        const list = lists.datas[listId];

        const removeList = () => {
            delete lists.datas[listId]
            const newDataIds = lists.dataIds.filter(dataId => dataId !== listId);
            setLists({
                ...lists,
                dataIds: newDataIds
            })
        }

        if (window.confirm(`Chắc chắn xóa cột "${list.title.trim()}"?`)) {
            removeList();
        }
        else return
    }

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        if (result.type === 'LIST') {
            const newList = lists;
            const [reorderedItem] = newList.dataIds.splice(result.source.index, 1);
            newList.dataIds.splice(result.destination.index, 0, reorderedItem);

            setLists(newList);
            return;
        }

        const sourceList = lists.datas[result.source.droppableId];
        const destinationList = lists.datas[result.destination.droppableId];
        const draggingTask = sourceList.tasks.filter(task => task.id === result.draggableId)[0]

        if (result.source.droppableId == result.destination.droppableId) {
            sourceList.tasks.splice(result.source.index, 1);
            sourceList.tasks.splice(result.destination.index, 0, draggingTask);

            setLists({
                ...lists,
                datas: { ...lists.datas, [sourceList.id]: destinationList }
            })
        }
        else {
            sourceList.tasks.splice(result.source.index, 1);
            destinationList.tasks.splice(result.destination.index, 0, draggingTask);

            setLists({
                ...lists,
                datas: { ...lists.datas, [destinationList.id]: destinationList }
            })
        }
    }

    return (
        <Context.Provider value={{ updateInputEdit, toggleEdit }}>
            <div className='body'>
                <form className='add__list' onSubmit={addList}>
                    <input
                        className='add__list--input'
                        ref={inputAddListRef}
                        value={inputAddList}
                        onChange={handleInputChange}
                        type='text'
                        placeholder='Thêm danh sách' />
                    <button className='add__list--btn' type='submit' disabled={!inputAddList}>ADD</button>
                </form>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='LIST' type='LIST' direction="horizontal">
                        {provided => (
                            <div className='content' {...provided.droppableProps} ref={provided.innerRef}>
                                {lists.dataIds.map((listId, index) => {
                                    const list = lists.datas[listId];
                                    return (
                                        <TaskList
                                            key={listId}
                                            list={list}
                                            index={index}
                                            addTask={addTask}
                                            deleteList={deleteList}
                                        />
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </Context.Provider>
    )
}

export default Body

