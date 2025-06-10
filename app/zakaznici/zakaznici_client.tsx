"use client";
import Accordion from 'react-bootstrap/Accordion';
import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux-store/store';
import { toggleAccordion, setActiveKey } from '@/app/redux-store/accordionSlice';
import { useAppSelector, useAppDispatch } from 'app/redux-store/hooks';

export const ZakazniciSubnavContent = () => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleAccordion());
  };

  return (
    <div>
      <button onClick={handleToggle}>
        Toggle Accordion 
      </button>
    </div>
  );
};
export const ZakazniciPage = () => {
  const activeKey = useAppSelector(state => state.accordion.activeKey);
  const dispatch = useAppDispatch();

  const toggle = () => {
    dispatch(toggleAccordion());
  };

  return (
    <div className="p-3">
      <h1>Zákazníci</h1>

      <Accordion activeKey={activeKey}>
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