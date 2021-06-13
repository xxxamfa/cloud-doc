import "./App.css";
// 引入BS
import "bootstrap/dist/css/bootstrap.min.css";
// 引入元件
import FileSearch from "./components/FileSearch";

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3">
          <FileSearch
            title="我的雲文檔"
            onFileSearch={(value) => {
              console.log(value);
            }}
          />
        </div>
        <div className="col-9 bg-primary">右邊</div>
      </div>
    </div>
  );
}

export default App;
