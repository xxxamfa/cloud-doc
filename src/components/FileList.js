import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import { faEdit, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import useKeyPress from "../hooks/useKeyPress";
import useContextMenu from "../hooks/useContextMenu";
import { getParentNode } from "../utils/helper";

// 透過remote取得主進程並解構API出來使用 start
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;
// 透過remote取得主進程並解構API出來使用 end

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  // 是否為修改狀態與修改的值
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");

  // 鍵盤hook使用
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  // 關閉輸入
  const closeSearch = (editItem) => {
    // 取消默認處理
    // e.preventDefault();
    setEditStatus(false);
    setValue("");
    if (editItem.isNew) {
      onFileDelete(editItem.id);
    }
  };
  //全域事件
  useEffect(
    () => {
      // enter=13 . exc=27
      const editItem = files.find((file) => file.id === editStatus);
      if (enterPressed && editStatus && value.trim() !== "") {
        onSaveEdit(editItem.id, value, editItem.isNew);
        setEditStatus(false);
        setValue("");
      } else if (escPressed && editStatus) {
        closeSearch(editItem);
      }
    }
    // // 使用
    // document.addEventListener("keyup", handleInputEvent);
    // // 釋放
    // return () => {
    //   document.removeEventListener("keyup", handleInputEvent);
    // };
  );

  const clickedItem = useContextMenu(
    [
      {
        label: "打開",
        click: () => {
          const parentElement = getParentNode(clickedItem.current, "file-item");
          if (parentElement) {
            onFileClick(parentElement.dataset.id);
          }
          console.log("parentElement", parentElement.dataset.id);
        },
      },
      {
        label: "重命名",
        click: () => {
          console.log("renaming");
        },
      },
      {
        label: "刪除",
        click: () => {
          console.log("deleting");
        },
      },
    ],
    ".file-list",[files]
  );

  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    if (newFile) {
      console.log("newFile.id", newFile.id);
      // ??????不懂這段
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);
  // watch
  // focus輸入框
  // 修改狀態時游標focus到輸入框
  let node = useRef(null);
  useEffect(() => {
    if (editStatus) {
      node.current.focus();
    }
  }, [editStatus]);
  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => (
        <li
          className="list-group-item bg-light row d-flex align-items-center file-item mx-0"
          key={file.id}
          data-id={file.id}
          data-title={file.title}
        >
          {file.id !== editStatus && !file.isNew && (
            <>
              <span className="col-2">
                <FontAwesomeIcon icon={faMarkdown} size="lg" />
              </span>
              <span
                className="col-6"
                onClick={() => {
                  onFileClick(file.id);
                }}
              >
                {file.title}
              </span>
              <button
                type="button"
                className="icon-button col-2 c-link"
                onClick={() => {
                  setEditStatus(file.id);
                  setValue(file.title);
                }}
              >
                <FontAwesomeIcon icon={faEdit} size="lg" title="編輯" />
              </button>
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => {
                  onFileDelete(file.id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} size="lg" title="刪除" />
              </button>
            </>
          )}
          {(file.id === editStatus || file.isNew) && (
            <>
              <input
                className="form-control col-10"
                value={value}
                placeholder="請輸入文件名稱"
                ref={node}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => closeSearch(file)}
              >
                <FontAwesomeIcon icon={faTimes} size="lg" title="關閉" />
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func,
};
export default FileList;
