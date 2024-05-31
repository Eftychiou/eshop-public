import { useEffect, useState, useRef, useContext } from 'react';
import classes from './left_navbar.module.scss';
import Image from 'next/image';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Category, CompanyInformation } from '@/my-api';
import { ModalsContext } from '@/store/';
// import { debounce } from 'lodash';

type LeftNavBarProps = {
  handleSelectedCategory: (category: Category, scroll: (c: string) => void) => void;
  categories: Array<Category>;
  companyInformation: CompanyInformation;
};

export const LeftNavbar = ({ handleSelectedCategory, categories, companyInformation }: LeftNavBarProps) => {
  const leftNavbarRef = useRef<HTMLDivElement>(null);

  const [activeCategories, setActiveCategories] = useState<Array<string>>([]);
  const modalsCtx = useContext(ModalsContext);

  useEffect(() => {
    const navbar = leftNavbarRef.current;
    const sticky = navbar.offsetTop;
    const stickToTop = () => {
      if (window.scrollY > sticky) navbar.classList.add(classes.sticky);
      else navbar.classList.remove(classes.sticky);
    };
    window.addEventListener('scroll', stickToTop);

    return () => window.removeEventListener('scroll', stickToTop);
  }, []);

  useEffect(() => {
    const navbar = leftNavbarRef.current;
    const sticky = navbar.offsetTop;
    (() => {
      if (window.scrollY > sticky) navbar.classList.add(classes.sticky);
      else navbar.classList.remove(classes.sticky);
    })();
  }, [modalsCtx.showSideDrawer]);

  useEffect(() => {
    const checkInnerWidth = () => {
      if (innerWidth > 768) {
        modalsCtx.showSideDrawer();
      }
    };
    window.addEventListener('resize', checkInnerWidth);
    return () => {
      window.removeEventListener('resize', checkInnerWidth);
    };
  }, []);

  const scrollToElId = (elId) => {
    document?.getElementById(elId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  function renderCategory(category: Category) {
    return (
      <div
        key={category._id}
        className={
          activeCategories.includes(category.categorySlug)
            ? [classes.category, classes.active].join(' ')
            : classes.category
        }
        onMouseOver={(e) => {
          e.stopPropagation();
          setActiveCategories((state) => {
            const newState = [...state];
            newState.push(category.categorySlug);
            return newState;
          });
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setActiveCategories((state) => {
            const newState = state.filter((c) => category.categorySlug !== c);
            return newState;
          });
        }}
      >
        <p
          className={classes.category}
          onClick={() => {
            return handleSelectedCategory(category, (c: string) => scrollToElId(c));
          }}
        >
          {category.categoryName}
        </p>

        {category.subcategories.length > 0 && (
          <div className={classes.subcategories}>{category.subcategories.map(renderCategory)}</div>
        )}
      </div>
    );
  }
  let attachedClasses = [classes.left_nav_bar, classes.Close];
  if (modalsCtx.activeSideDrawer) {
    attachedClasses = [classes.left_nav_bar, classes.Open];
  }

  return (
    <div
      ref={leftNavbarRef}
      className={attachedClasses.join(' ')}
      onMouseLeave={() => {
        setActiveCategories([]);
      }}
    >
      <div className={classes.content}>
        <div className={classes.logo}>
          {companyInformation?.logoUrl && (
            <Image src={`${process.env.SERVER_DOMAIN}${companyInformation.logoUrl}`} alt='logo' fill priority />
          )}
        </div>
        <div className={classes.searchBar}>
          <input type='text' />
          <FontAwesomeIcon icon={faSearch} className={classes.magnet} />
        </div>

        <div className={classes.categories}>
          <div className={classes.category} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Home
          </div>
          <div className={classes.category} onClick={() => scrollToElId('Discounts')}>
            Discounts
          </div>
          {categories.map(renderCategory)}
        </div>
      </div>
    </div>
  );
};
