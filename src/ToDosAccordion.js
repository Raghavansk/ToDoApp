import React, { useReducer, useState } from "react";
import PropTypes from "prop-types";

function generateUniqueId() {
  return Math.floor(100 * Math.random());
}
const initialState = {
  categories: [],
};
function reducer(state, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case "category/add":
      return {
        ...state,
        categories: [...state.categories, action.payLoad],
      };
    case "category/delete":
      return {
        ...state,
        categories: state.categories.filter(
          (todo) => todo.id !== action.payLoad.id
        ),
      };
    case "category/addToDo":
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.name === action.payLoad.categoryName) {
            const { id, name } = action.payLoad;
            return {
              ...category,
              categoryName: action.payLoad.categoryName,
              toDoList: [...category.toDoList, { id, name }],
            };
          }
          return category;
        }),
      };
    case "category/deleteToDo":
      return {
        ...state,
        categories: state.categories.map((category) => {
          return {
            ...category,
            toDoList: category.toDoList.filter(
              (toDoListItem) => toDoListItem.id !== action.payLoad.id
            ),
          };
        }),
      };
    case "category/todoToggle":
      return {
        ...state,
        categories: state.categories.map((category) => {
          return {
            ...category,
            toDoList: category.toDoList.map((toDoListItem) => {
              if (toDoListItem.id === action.payLoad.id) {
                return {
                  ...toDoListItem,
                  isSelected: action.payLoad.isSelected,
                };
              }
              return toDoListItem;
            }),
          };
        }),
      };
    case "category/toDoToggleExpand":
      return {
        ...state,
        categories: state.categories.map((category) => {
          if (category.name === action.payLoad.categoryName) {
            const { isExpanded } = action.payLoad;
            return {
              ...category,
              isExpanded,
            };
          }
          return category;
        }),
      };
  }
}
function clearInput(e) {
  e.target.previousElementSibling.value = "";
}
const ToDosAccordion = function (props) {
  const [categoryName, setCategoryName] = useState("");
  const [todoValue, setTodoValue] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <section className="todo-accordion">
      <ul>
        {state.categories.map((category, index) => {
          return (
            <li
              key={index}
              className={category.isExpanded ? "expand" : "collapse"}
            >
              <h3>
                <button
                  onClick={() =>
                    dispatch({
                      type: "category/toDoToggleExpand",
                      payLoad: {
                        categoryName: category.name,
                        isExpanded: !category.isExpanded,
                      },
                    })
                  }
                ></button>
                {category.name}
              </h3>
              <section className="todo">
                <ul>
                  {category.toDoList &&
                    category.toDoList.map((item) => {
                      return (
                        <li
                          key={item.id}
                          data-id={item.id}
                          className={item.isSelected ? "task-completed" : null}
                        >
                          <input
                            type="checkbox"
                            onClick={() =>
                              dispatch({
                                type: "category/todoToggle",
                                payLoad: {
                                  id: item.id,
                                  isSelected: !item.isSelected,
                                },
                              })
                            }
                          />
                          {item.name}
                          <button
                            onClick={() =>
                              dispatch({
                                type: "category/deleteToDo",
                                payLoad: { id: item.id },
                              })
                            }
                          >
                            Delete
                          </button>
                        </li>
                      );
                    })}
                </ul>
                {category.toDoList.length === 0 ? (
                  <span>There are no tasks yet! Do you want to add?</span>
                ) : null}
                <div className="todo-input">
                  <input
                    type="text"
                    onChange={(event) => setTodoValue(event.target.value)}
                  />
                  <button
                    onClick={(event) => {
                      dispatch({
                        type: "category/addToDo",
                        payLoad: {
                          name: todoValue,
                          categoryName: category.name,
                          id: generateUniqueId(),
                        },
                      });
                      clearInput(event);
                    }}
                  >
                    Add
                  </button>
                </div>
              </section>
            </li>
          );
        })}
      </ul>
      {state.categories.length === 0 ? (
        <span>Please go ahead and add category</span>
      ) : null}
      <div className="todo-input">
        <input
          type="text"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
        />
        <button
          onClick={(event) => {
            dispatch({
              type: "category/add",
              payLoad: {
                name: categoryName,
                isExpanded: false,
                toDoList: [],
                id: generateUniqueId(),
              },
            });
            setCategoryName("");
          }}
        >
          Add category
        </button>
      </div>
    </section>
  );
};

ToDosAccordion.propTypes = {
  toDosList: PropTypes.array,
};
export default ToDosAccordion;
