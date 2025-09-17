/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos, getUser } from './api';
import { Todo } from './types/Todo';
import { User } from './types/User';

type FilterStatus = 'all' | 'completed' | 'active';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<boolean>(true);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setLoadingTodos(true);
    getTodos().then(fetchedTodos => {
      setTodos(fetchedTodos);
      setLoadingTodos(false);
    });
  }, []);

  useEffect(() => {
    setLoadingUser(true);
    getUser(1).then(fetchedUser => {
      setUser(fetchedUser);
      setLoadingUser(false);
    });
  }, []);

  const filteredByStatus = todos.filter(todo => {
    if (filterStatus === 'all') {
      return true;
    }

    if (filterStatus === 'completed') {
      return todo.completed;
    }

    if (filterStatus === 'active') {
      return !todo.completed;
    }

    return true;
  });

  const filteredTodos = filteredByStatus.filter(todo =>
    todo.title.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleTodos = filteredTodos;

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            {user && <p>User: {user.name}</p>}

            <div className="block">
              <TodoFilter
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                query={query}
                setQuery={setQuery}
              />
            </div>

            <div className="block">
              {loadingTodos || loadingUser ? (
                <Loader />
              ) : (
                <TodoList
                  todos={visibleTodos}
                  onShow={setSelectedTodo}
                  selectedTodo={selectedTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal todo={selectedTodo} onClose={() => setSelectedTodo(null)} />
      )}
    </>
  );
};
