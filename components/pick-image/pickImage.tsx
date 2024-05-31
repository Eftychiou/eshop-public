import Image from 'next/image';
import { useState, useEffect, ChangeEventHandler, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classes from './pickImage.module.scss';

import { Api } from '@/my-api';
import { Button } from '../button';

type PickImageProps = {
  loadedImagesUrl: Array<string>;
  fileLimit: number;
  onFileListChangeHandler: (fileList: Array<File>) => void;
  onError?: (error: string) => void;
  pickImageReset?: number;
};

export const PickImage = ({
  loadedImagesUrl,
  fileLimit,
  onFileListChangeHandler,
  onError,
  pickImageReset
}: PickImageProps) => {
  const inputRef = useRef<HTMLInputElement>();
  const [fileIndex, setFileIndex] = useState(-1);
  const [filePaths, setFilePaths] = useState<Array<string>>([]);
  const [fileList, setFileList] = useState<Array<File>>([]);

  useEffect(() => {
    if (loadedImagesUrl) {
      const files = loadedImagesUrl?.map((image) => Api.getImage({ url: image }));
      Promise.all(files)
        .then((res) => {
          const theFiles = res.map((r) => {
            const [, fileName] = r.config.url.match(/\/([^\/]+)$/);
            return new File([r.data], fileName, { type: r.headers['content-type'] });
          });
          setFileList(theFiles);
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [loadedImagesUrl]);

  useEffect(() => {
    if (pickImageReset > 0) {
      setFileList([]);
    }
  }, [pickImageReset]);

  useEffect(() => {
    if (fileList) {
      setFilePaths(fileList.map((f) => URL.createObjectURL(f)));
    }
  }, [fileList]);

  useEffect(() => {
    onFileListChangeHandler && onFileListChangeHandler(fileList);
  }, [fileList]);

  const fileSelectedHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFileList((state) => {
      const theFileList = Array.from(event.target.files);
      const newState = [...state, ...theFileList];
      if (newState.length > fileLimit) {
        onError && onError(`Only ${fileLimit} images can be uploaded`);
        return state;
      }
      inputRef.current.value = '';
      return newState;
    });
  };

  const swapArrayElements = (arr: File[], indexA: number, indexB: number) => {
    const temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
  };

  const onDragEnd = (param) => {
    const sourceIndex = param.source.index as number;
    const destinationIndex = param.destination.index as number;

    setFileList((state) => {
      const newState = [...state];
      swapArrayElements(newState, sourceIndex, destinationIndex);
      return newState;
    });
  };

  const deleteImage = () => {
    if (fileIndex < 0) {
      setFileList((state) => {
        const newState = [...state];
        newState.pop();
        return newState;
      });
      return;
    }
    setFileList((state) => {
      const newState = [...state];
      newState.splice(fileIndex, 1);
      return newState;
    });
  };

  return (
    <div className={classes.pick_image}>
      <div className={classes.outerContainer}>
        <div className={classes.container}>
          <DragDropContext onDragEnd={(...props) => onDragEnd(props[0])}>
            <Droppable droppableId='droppable-1' direction='horizontal'>
              {(provided, _snapshot_) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <ul className={classes.imagesList}>
                    {filePaths?.map((filePath, index) => (
                      <Draggable Draggable key={filePath} draggableId={'draggable-' + filePath} index={index}>
                        {(provided, _snapshot) => (
                          <div
                            onClick={() => setFileIndex((state) => (state === index ? -1 : index))}
                            key={filePath}
                            className={
                              index !== fileIndex ? classes.image : [classes.image, classes.selectedImage].join(' ')
                            }
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Image
                              alt='product_image'
                              src={filePath || '/images/other/noImage.jpg'}
                              key={filePath}
                              fill
                              sizes='264px'
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <input
            ref={inputRef}
            className={classes.inputElement}
            type='file'
            multiple
            accept='image/png, image/gif, image/jpeg'
            onChange={fileSelectedHandler}
          />
          <div className={classes.controlButtons}>
            <Button
              className='Button'
              type='button'
              onClick={() => {
                inputRef.current.click();
              }}
            >
              +
            </Button>
            <Button onClick={deleteImage} className='Button' type='button'>
              -
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
