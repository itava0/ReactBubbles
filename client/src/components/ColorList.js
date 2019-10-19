import React, { useState } from "react";
import { axiosWithAuth } from '../utils';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState(initialColor);

  const editColor = color => {
    console.log(color)
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      // return back the color update
      .then(res => {
        //needs to UpdateColors
        const newItem = colors.map(item => {
          if( item.id === res.data.id) {
            return res.data
          }
          return item
        })
        console.log(newItem)
        updateColors(newItem)
      })
      .catch(err => console.log(err.response))
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(res => {
        console.log(res)
        //needs to filter the colors the wasn't delete it.
        updateColors([...colors.filter( item => item.id !== color.id)])
        setEditing(false);
      })
      .catch(error => console.log(error))
  };


  const changeColor = event => {
    setNewColor({ ...newColor, color: event.target.value });
  };

  const changeHex = event => {
    setNewColor({ ...newColor, code: { hex: event.target.value } });
  };

  const submitForm = event => {
    event.preventDefault();
    axiosWithAuth()
    .post("/api/colors", newColor)
    .then(res => updateColors(res.data))
    .catch(error => console.log(error))
    setNewColor({
      color: "",
      code: { hex: "" }
    });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
      <form onSubmit={submitForm} className="Form">
        <input
          type="text"
          name="color"
          onChange={changeColor}
          placeholder="ColorName"
          value={newColor.color}
        />
        <input
          type="text"
          name="code"
          onChange={changeHex}
          placeholder="Hex Color"
          value={newColor.code.hex}
        />
        <button>Add</button>
      </form>
    </div>
  );
};

export default ColorList;
