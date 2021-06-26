import "./App.css";
// 引入BS
import "bootstrap/dist/css/bootstrap.min.css";
// 引入元件
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFiles";
import BottomBtn from "./components/BottomBtn";
import {
  faFileImport,
  faPlus,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import TabList from "./components/TabList";
import { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { v4 as uuidv4 } from "uuid";
import { flattenArr, objToArr } from "./utils/helper";
import fileHelper from "./utils/fileHelper";
// node 模塊
// 路徑組合功能
const { join } = window.require("path");
// 直接使用主進程API可透過remote
const { remote } = window.require("electron");
// 使用electron-store
const Store = window.require("electron-store");
// 起手式
const fileStore = new Store({ name: "Files Data" });

// 重組需要存到electron-store的資料.像isNew判斷資料和body大型資料不要存進去.body存本機就好(用fs)
// 小技巧:物件轉arra更好處理
const saveFilesToStore = (files) => {
  const fileStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createsAt } = file;
    result[id] = {
      id,
      path,
      title,
      createsAt,
    };
    return result;
  }, {});
  fileStore.set("files", fileStoreObj);
};

function App() {
  // 如果沒資料就給空物件
  const [files, setFiles] = useState(fileStore.get("files") || {});
  const [activeFileID, setActiveFileID] = useState("");
  const [openedFileIDs, setOpenedFileIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const filesArr = objToArr(files);
  // 取得文檔位置
  const savedLocation = remote.app.getPath("documents");

  const fileClick = (fileID) => {
    setActiveFileID(fileID);
    const currentFile = files[fileID];
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }

    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID]);
    }
  };
  const activeFile = files[activeFileID];

  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };

  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter((fileID) => fileID !== id);
    setOpenedFileIDs(tabsWithout);
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0]);
    } else {
      setActiveFileID("");
    }
  };

  const fileChange = (id, value) => {
    const newFile = { ...files[id], body: value };
    setFiles({ ...files, [id]: newFile });
    if (!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id]);
    }
  };

  const deleteFile = (id) => {
    if (files[id].isNew) {
      // 法一 . 因為刪除資料有修改資料卻沒用setXXX.所以files資料室沒變的.解:必用...匯入新的資料
      // delete files[id];
      // setFiles({ ...files });
      // 法二 . afterDelete:刪掉[id]: value後剩下的
      const { [id]: value, ...afterDelete } = files;
      setFiles(afterDelete);
    } else {
      fileHelper.deleteFile(files[id].path).then(() => {
        delete files[id];
        setFiles({ ...files });
        saveFilesToStore(files);
        // 重要bug修復
        tabClose(id);
      });
    }
  };
  const updateFileName = (id, title, isNew) => {
    const newPath = join(savedLocation, `${title}.md`);
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath };
    const newFiles = { ...files, [id]: modifiedFile };
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    } else {
      const oldPath = join(savedLocation, `${files[id].title}.md`);

      fileHelper.renameFile(oldPath, newFiles).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
  };
  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter((file) => {
      return file.title.includes(keyword);
    });
    setSearchedFiles(newFiles);
  };

  const createNewFile = () => {
    const newID = uuidv4();
    const newFile = {
      id: newID,
      title: "",
      body: "## 請輸入",
      createdAt: new Date().getTime(),
      isNew: true,
    };
    setFiles({ ...files, [newID]: newFile });
  };

  const saveCurrentFile = () => {
    fileHelper
      .writeFile(join(savedLocation, `${activeFile.title}.md`), activeFile.body)
      .then(() => {
        setUnsavedFileIDs(unsavedFileIDs.filter((id) => id !== activeFile.id));
      });
  };

  const openedFiles = openedFileIDs.map((openID) => {
    return files[openID];
  });
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch title="我的雲文檔" onFileSearch={fileSearch} />
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={updateFileName}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBtnClick={createNewFile}
              ></BottomBtn>
            </div>
            <div className="col">
              <BottomBtn
                text="導入"
                colorClass="btn-success"
                icon={faFileImport}
              ></BottomBtn>
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFile && (
            <div className="start-page">选择或者创建新的 Markdown 文档</div>
          )}
          {activeFile && (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {
                  fileChange(activeFile.id, value);
                }}
                options={{
                  minHeight: "515px",
                }}
              />
              <BottomBtn
                text="導入"
                colorClass="btn-success"
                icon={faSave}
                onBtnClick={saveCurrentFile}
              ></BottomBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
