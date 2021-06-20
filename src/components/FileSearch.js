import React, { useEffect, useRef, useState } from "react";
// 引用FontAwesome start
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
// 引用FontAwesome end
// 引入傳入型別檢查工具
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";
const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");

  // 鍵盤hook使用
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  // 按搜尋時游標focus到輸入框
  let node = useRef(null);
  // method寫這
  // 關閉搜尋
  const closeSearch = () => {
    // 取消默認處理
    // e.preventDefault();
    setInputActive(false);
    setValue("");
    onFileSearch("");
  };
  //全域事件
  useEffect(() => {
    // const handleInputEvent = (event) => {
    //   const { keyCode } = event;
    //   // enter=13 . exc=27
    //   if (keyCode === 13 && inputActive) {
    //     onFileSearch(value);
    //   } else if (keyCode === 27 && inputActive) {
    //     closeSearch(event);
    //   }
    // };
    // // 使用
    // document.addEventListener("keyup", handleInputEvent);
    // // 釋放
    // return () => {
    //   document.removeEventListener("keyup", handleInputEvent);
    // };

    if (enterPressed && inputActive) {
      onFileSearch(value);
    }
    if (escPressed && inputActive) {
      closeSearch();
    }
  });
  // watch
  // focus輸入框
  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive]);
  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
      {!inputActive && (
        <>
          <span>{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setInputActive(true);
            }}
          >
            <FontAwesomeIcon icon={faSearch} size="lg" title="搜尋" />
          </button>
        </>
      )}
      {/* inputActive為true就顯示後面<div>... */}
      {inputActive && (
        <>
          <input
            className="form-control"
            value={value}
            ref={node}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button type="button" className="icon-button" onClick={closeSearch}>
            <FontAwesomeIcon icon={faTimes} size="lg" title="關閉" />
          </button>
        </>
      )}
    </div>
  );
};

// 檢查型別 . isRequired:必傳入
FileSearch.propTypes = {
  title: PropTypes.string,
  inFileSearch: PropTypes.func.isRequired,
};

// 預設傳入值設定
FileSearch.defaultProps = {
  title: "j8 d8 d8",
};

export default FileSearch;
