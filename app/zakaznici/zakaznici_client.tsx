"use client";
import Accordion from 'react-bootstrap/Accordion';
import React, {useRef, useEffect} from "react";
import {  useDispatch } from 'react-redux';
import { toggleAccordion, toggleDifAcc } from '@/app/redux-store/accordionSlice';
import { useAppSelector, useAppDispatch } from 'app/redux-store/hooks';

export const ZakazniciSubnavContent = () => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleAccordion());
  };

    const handleDifToggle = () => {
    dispatch(toggleDifAcc());
  };


  return (
    <div className='d-flex align-items-center '>
      <button onClick={handleToggle}>
        Toggle Accordion 
      </button>

      <button onClick={handleDifToggle}>
        Toggle  diff accordion
      </button>
    </div>
  );
};
export const ZakazniciPage = () => {
  const activeKey = useAppSelector(state => state.accordion.activeKey);
  const dispatch = useAppDispatch();

  const diffAcc = useAppSelector(state => state.accordion.difKeyTest);
  const difAccordionRef = useRef<HTMLDivElement>(null);
  const toggle = () => {
    dispatch(toggleAccordion());
  };

   useEffect(() => {
    if (diffAcc === "0" && difAccordionRef.current) {
      difAccordionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [diffAcc]);

  const isSubnavOpen = useAppSelector(state => state.accordion.isSubnavOpen);
  return (
    <div className="p-3" style={{ marginTop: isSubnavOpen ? "5rem" : "0" }}>
      <h1>Zákazníci</h1>
      {/*to do */}
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion activeKey={activeKey}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion activeKey={diffAcc} ref={difAccordionRef}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Detail zákazníka</Accordion.Header>
          <Accordion.Body>
            Tady je nějaký obsah accordionu o zákazníkovi.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <button onClick={toggle} className="btn btn-secondary mt-3">
        {activeKey === "0" ? "Zavřít accordion (page)" : "Otevřít accordion (page)"}
      </button>
    </div>
  );
};