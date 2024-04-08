import "./styles.css";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import React from "react";
import MapComponent from "./components/MapContent";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  function usePersistedState(key, defaultValue) {
    const [state, setState] = useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue,
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }

  const [tasks, setTasks] = usePersistedState("tasks", []);
  // const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [lastInsertedId, setLastInsertedId] = useState("");
  console.log(tasks);

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    // localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  const taskList = tasks?.filter(FILTER_MAP[filter]).map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      // latitude={task.location.latitude}
      // longitude={task.location.longitude}
      location={task.location}
      toggleTaskCompleted={toggleTaskCompleted}
      photoedTask={photoedTask}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    // localStorage.setItem("tasks", JSON.stringify(remainingTasks));
  }

  function addTask(name) {
    const id = "todo-" + nanoid();
    const newTask = {
      id: id,
      name: name,
      completed: false,
      location: { latitude: "##", longitude: "##", error: "##" },
    };
    setLastInsertedId(id);
    setTasks([...tasks, newTask]);
    // localStorage.setItem("tasks", JSON.stringify(...tasks, newTask));
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, name: newName };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
    // localStorage.setItem("tasks", JSON.stringify(editedTaskList));
  }

  function locateTask(id, location) {
    console.log("locate Task", id, " before");
    console.log(location, tasks);
    const locatedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, location: location };
      }
      return task;
    });
    console.log(locatedTaskList);
    setTasks(locatedTaskList);
    // localStorage.setItem("tasks", JSON.stringify(locatedTaskList));
  }

  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, photo: true };
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList);
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const geoFindMe = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
    console.log(
      `Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`,
    );
    locateTask(lastInsertedId, {
      latitude: latitude,
      longitude: longitude,
      error: "",
    });
  };
  const error = () => {
    console.log("Unable to retrieve your location");
  };

  // const App = () => {
  //   return (
  //     <div style={{ height: '40vh', width: '50%' }}>
  //       {/* <MapComponent /> */}
  //     </div>
  //   );
  // }

  return (
    <div className="todoapp stack-large">
      <h1>Geo TodoMatic</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe} />
      {""}

      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;