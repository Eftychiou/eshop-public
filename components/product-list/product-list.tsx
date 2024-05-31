import { useRef, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { ModalsContext } from '@/store/';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useRouter } from 'next/router';

import classes from './product-list.module.scss';
import { Api, Product } from '@/my-api';
import { useProducts } from '@/hooks';
import { Button } from '../button';

type ProductsListProps = {
  selectedCategoryId: string;
  selectProduct: Dispatch<SetStateAction<Product>>;
  topSale: boolean;
  product: Product;
};

export const ProductList = ({ selectedCategoryId, selectProduct, topSale, product }: ProductsListProps) => {
  const router = useRouter();
  const productListRef = useRef<HTMLUListElement>(null);
  const modalsCtx = useContext(ModalsContext);

  const { products, refetchProducts } = useProducts({ category: selectedCategoryId, topSale });

  useEffect(() => {
    refetchProducts();
  }, [product]);

  const deleteProduct = (productId) => {
    Api.deleteProduct({ productId })
      .then((res) => {
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
        refetchProducts();
      })
      .catch((err: Error) => {
        modalsCtx.showNotification({
          message: err.message,
          status: 'error'
        });
      });
  };

  const onDragEnd = (param) => {
    const sourceIndex = param.source.index;
    const destinationIndex = param.destination.index;

    Api.swapProductsIndex({
      sourceProduct: {
        id: products[sourceIndex]._id,
        index: products[sourceIndex].index.toString()
      },
      destinationProduct: {
        id: products[destinationIndex]._id,
        index: products[destinationIndex].index.toString()
      }
    })
      .then((res) => {
        modalsCtx.showNotification({ message: res.data.message, status: 'success' });
        refetchProducts();
      })
      .catch((err: Error) => {
        modalsCtx.showNotification({
          message: err.message,
          status: 'error'
        });
      });
  };

  const updateProduct = (p: Product) => {
    selectProduct(product?._id === p._id ? null : p);
    productListRef.current.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className={classes.mainContainer}>
      <hr />
      <DragDropContext onDragEnd={(...props) => onDragEnd(props[0])}>
        <Droppable droppableId='droppable-1' direction='horizontal'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {products.length !== 0 && (
                <ul className={classes.updateProductForm} ref={productListRef}>
                  {products.map((p, i) => (
                    <Draggable Draggable key={p._id} draggableId={'draggable-' + p._id} index={i}>
                      {(provided) => (
                        <div
                          className={classes.outer_container}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div
                            className={
                              p._id === product?._id ? [classes.product, classes.selected].join(' ') : classes.product
                            }
                          >
                            <h4>{p.title}</h4>
                            <div className={classes.buttons_container}>
                              <Button className={classes.button} onClick={() => router.push(`/products/${p._id}`)}>
                                View
                              </Button>
                              <Button
                                className={classes.button}
                                onClick={() => {
                                  updateProduct(p);
                                }}
                              >
                                Update
                              </Button>
                              <Button className={classes.button} onClick={() => deleteProduct(p._id)}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
