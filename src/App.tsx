import { ChangeEvent, useState } from 'react';
import { v4 } from 'uuid';
import styles from './App.module.scss';

type Dummy = {
  quizId: string;
  teacherId: string;
  name: string;
  createdAt: string;
  images: Image[];
};

type Image = {
  id: string;
  image: string;
  lines?: string[];
  points?: string[];
};

const dummy: Dummy[] = [
  // {
  //   quizId: 'fe84dde6-68f2-4b7b-90e7-61ff242f3bb1',
  //   teacherId: '270e39a7-cefa-46cf-b894-a7b0b397778c',
  //   name: '山田くん',
  //   createdAt: '2022/10/2 20:40:21',
  //   images: [
  //     {
  //       id: 1,
  //       image:
  //         'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8c3R1ZHl8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  //     },
  //     {
  //       id: 2,
  //       image:
  //         'https://images.unsplash.com/photo-1664448021770-7e4dfc780bee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
  //     },
  //     {
  //       id: 3,
  //       image:
  //         'https://images.unsplash.com/photo-1664448003365-e1b05ffd509d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
  //     },
  //   ],
  // },
  // {
  //   quizId: 'fe84dde6-68f2-4b7b-90e7-61ff242f3bb1',
  //   teacherId: '270e39a7-cefa-46cf-b894-a7b0b397778c',
  //   name: '白鳥くん',
  //   createdAt: '2022/10/2 20:40:21',
  //   images: [
  //     {
  //       id: 1,
  //       image:
  //         'https://images.unsplash.com/photo-1664466935816-4cf27816333e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  //     },
  //     {
  //       id: 2,
  //       image:
  //         'https://images.unsplash.com/photo-1664629918792-88c2cc34fa58?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  //     },
  //     {
  //       id: 3,
  //       image:
  //         'https://images.unsplash.com/photo-1664574654578-d5a6a4f447bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
  //     },
  //   ],
  // },
];

type Props = {};
const App = (props: Props) => {
  const [canvasData, setCanvasData] = useState(dummy);
  const [pageIndex, setPageIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const [uploadedImages, setUploadedImages] = useState<
    (string | ArrayBuffer)[]
  >([]);

  // 現在の問題のページインデックス
  const currentPage = canvasData[pageIndex];
  const currentImage: Image = currentPage?.images[imageIndex];

  const firstPage = pageIndex + 1; // 1ページ目のため
  const firstImage = imageIndex + 1; // 1枚目のため

  /**
   * 1枚目の画像を表示する
   */
  const resetImageIndex = () => {
    setImageIndex(0);
  };

  const selectFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    for (const file of fileList) {
      const fileReader: FileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = async (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (!result) {
          console.log('error');
          return;
        }

        setUploadedImages(prev => {
          return prev.concat(result);
        });
      };
    }
  };

  /**
   * 画像データをPOSTリクエストでバックエンドへ送信する
   */
  const uploadFiles = (uploadedImages: (string | ArrayBuffer)[]) => {
    // Imageデータ構造へ変換
    const convertUploadedImage: Image[] = uploadedImages.map(item => ({
      id: v4(),
      image: item as string,
    }));

    // 新しいCanvasデータの作成
    const newCanvasData: Dummy = {
      quizId: 'quiz111',
      teacherId: 'teacher111',
      images: convertUploadedImage,
      createdAt: '2022/10/03',
      name: `生徒${canvasData.length + 1}`,
    };

    // バックエンドリクエストを叩く
    // POST

    // ローカル上の変更
    setCanvasData(prev => [...prev, newCanvasData]);
  };

  // ページの切り替え
  const incrementPageIndex = () => {
    setPageIndex(prev => prev + 1);
  };
  const decrementPageIndex = () => {
    setPageIndex(prev => prev - 1);
  };

  // 画像の切り替え
  const incrementImageIndex = () => {
    setImageIndex(prev => prev + 1);
  };
  const decrementImageIndex = () => {
    setImageIndex(prev => prev - 1);
  };

  // 画像編集のダミー
  // 現在閲覧中の画像に対して編集を加える
  const editImage = (currentImage: Image): Image => {
    const current = { ...currentImage };

    const lines = [v4(), '2', '3', '4'];
    const points = ['1', '2', '3', '4'];

    current.lines = lines;
    current.points = points;

    return current;
  };

  const handleEditImageClick = () => {
    const current = editImage(currentImage);

    setCanvasData(prev =>
      prev.map((item, index) => {
        if (index === pageIndex) {
          const currentImage = currentPage.images.map(item => {
            if (item.id === current.id) {
              return current;
            } else {
              return item;
            }
          });
          return { ...item, images: currentImage };
        } else {
          return item;
        }
      })
    );
  };

  // Handlers
  const handleNextPageClick = () => {
    if (firstPage >= canvasData.length) return;
    incrementPageIndex();
    resetImageIndex();
  };
  const handlePrevPageClick = () => {
    if (0 >= pageIndex) return;
    decrementPageIndex();
    resetImageIndex();
  };

  const handleNextImageClick = () => {
    if (firstImage >= currentPage.images.length) return;
    incrementImageIndex();
  };
  const handlePrevImageClick = () => {
    if (0 >= imageIndex) return;
    decrementImageIndex();
  };

  const handleUploadClick = async () => {
    uploadFiles(uploadedImages);

    // リセット
    setUploadedImages([]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    selectFiles(e);
  };

  const handleSaveClick = () => {
    localStorage.setItem('current', JSON.stringify(canvasData));
  };

  const handleImportClick = () => {
    const item = localStorage.getItem('current');
    if (item) {
      const data: Dummy[] = JSON.parse(item);
      setCanvasData(data);
    }
  };

  const handleClearClick = () => {
    localStorage.removeItem('current');
  };

  return (
    <main className={styles.main}>
      <div className={styles['container']}>
        <section className={styles.section}>
          <div className={styles.section__group}>
            <h2 className={styles.section__title}>Main Component</h2>
            <div>
              <input
                onChange={handleFileChange}
                type="file"
                name=""
                id=""
                multiple
              />
              {uploadedImages.length > 0 && (
                <button onClick={handleUploadClick}>
                  {uploadedImages.length}枚のファイルがアップロード待ちです
                </button>
              )}
              <button onClick={handleSaveClick}>保存</button>
              <button onClick={handleImportClick}>インポート</button>
              <button onClick={handleClearClick}>保存のクリア</button>
            </div>
          </div>

          <div className={styles.section__body}>
            <div className={styles.canvas}>
              {currentPage && (
                <div className={styles.stage}>
                  <header className={styles.stage__header}>
                    <div>
                      <p className={styles.stage__name}>{currentPage.name}</p>
                      <p>{currentPage.createdAt}</p>
                    </div>

                    <div className={styles.buttonContainer}>
                      <button
                        onClick={handlePrevPageClick}
                        className={`${styles.button} ${styles.inverted}`}
                      >
                        前のページ
                      </button>
                      <p>
                        {firstPage}/{canvasData.length}
                      </p>
                      <button
                        onClick={handleNextPageClick}
                        className={`${styles.button} ${styles.inverted}`}
                      >
                        次のページ
                      </button>
                    </div>
                  </header>

                  <div className={styles.buttonContainer}>
                    <button
                      onClick={handlePrevImageClick}
                      className={styles.button}
                    >
                      前の画像
                    </button>
                    <p>
                      {firstImage}/{currentPage.images.length}
                    </p>
                    <button
                      onClick={handleNextImageClick}
                      className={styles.button}
                    >
                      次の画像
                    </button>
                  </div>

                  <img
                    onClick={handleEditImageClick}
                    className={styles.stage__image}
                    src={currentImage.image}
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default App;
