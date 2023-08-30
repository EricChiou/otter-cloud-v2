import { useRef } from 'react';

import useTaskStore from '@/store/task.store';
import TaskComponent from './TaskComponent';

export default function TaskList() {
  const store = useTaskStore();
  const taskHeight = 29;
  const maxRunTaskNum = 5;
  const className = useRef(`
    max-h-[${taskHeight * maxRunTaskNum}px]
    border
    border-b-0
    border-solid
    border-gray
    overflow-hidden
    hover:overflow-y-auto
  `);

  function removeTask(id: number) {
    store.deleteTask(id);
  }

  if(!store.list.length) return null;
  return (<>
    <div className="m-4">
      <div className={className.current}>
        {store.list.map((task, i)=> (
          <TaskComponent
            key={task.id}
            task={task}
            removeTask={removeTask}
            index={i}
            maxRunTaskNum={maxRunTaskNum}
          ></TaskComponent>
        ))}
      </div>
    </div>
  </>);
}