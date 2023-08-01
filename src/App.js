import './App.css';
import {useEffect, useState} from "react";
import {LABEL_TO_DO_LIST_STORAGE, TO_DO_DONE, TO_DO_PROCESSING} from "./constants";

const App = () => {
  const [toDoList, setToDoList] = useState(() => {
    const dataToDoList = localStorage.getItem(LABEL_TO_DO_LIST_STORAGE);
    const dataInitial = JSON.parse(dataToDoList);
    return Array.isArray(dataInitial) ? dataInitial : [];
  });
  const [toDo, setToDo] = useState('');

  useEffect(() => {
    localStorage.setItem(LABEL_TO_DO_LIST_STORAGE, JSON.stringify(toDoList))
  }, [toDoList])
  const handleChange = (event) => {
    setToDo(event.target.value)
  }
  const addToDo = () => {
    if (toDo !== '') {
      setToDoList(prev => {
        const now = new Date();
        return [{
          id: now.valueOf(),
          label: toDo,
          status: TO_DO_PROCESSING,
          createdAt: now,
        }].concat(prev)
      })
      setToDo('');
    }
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addToDo();
    }
  }

  const removeToDoItem = (id) => {
    setToDoList(prev => {
      return prev.filter((toDoItem, index) => {
        return toDoItem.id !== id;
      })
    })
  }
  const onChangeToDoStatus = (id) => {
    setToDoList(prev => {
      return prev.map((toDoItem, index) => {
        if (toDoItem.id === id) {
          return {
            ...toDoItem,
            status: toDoItem.status === TO_DO_DONE ? TO_DO_PROCESSING : TO_DO_DONE
          }
        } else {
          return toDoItem;
        }
      })
    })
  }

  return (
      <div className="app">
        <div className="header">
          <h2>To Do List - React</h2>
          <div className="input">
            <input
                onChange={handleChange}
                type="text"
                value={toDo}
                placeholder="Title..."
                onKeyDown={handleKeyDown}
            />
            <span className="addBtn" onClick={() => addToDo()}>Add</span>
          </div>
        </div>
        <div className="body">
          <ul>
            {
              toDoList.map((toDoItem, index) => {
                return (
                    <li key={index} onClick={() => onChangeToDoStatus(toDoItem.id)} className={toDoItem.status === TO_DO_DONE ? "checked" : ""}>
                      <span className="checkedIcon"></span>
                      <span className="label" >
                          {toDoItem.label}
                      </span>
                      <span onClick={() => removeToDoItem(toDoItem.id)} className="close">
                        ×
                      </span>
                    </li>
                )
              })
            }
          </ul>
        </div>
      </div>
  );
}

export default App;
