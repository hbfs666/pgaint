import React, { useState, useEffect } from "react";
import SkeletonCard from "../components/SkeletonCard";

const DelayedRender = ({ children, delay = 1000,Skeleton }) => {
    const [isReady, setIsReady] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, delay);
  
      return () => clearTimeout(timer);
    }, [delay]);
  
    return isReady ? <>{children}</> : <Skeleton />;
  };


  export default DelayedRender;