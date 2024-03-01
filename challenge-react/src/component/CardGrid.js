import React, { useState, useEffect } from 'react';
import './CardGrid.css';

const CardGrid = ({ charities, handleDonate, isDonationWindowOpen, selectedCharity, handleDonationWindowToggle }) => {
    const [localSelectedAmount, setLocalSelectedAmount] = useState(10);

    const handleRadioChange = (amount) => {
        setLocalSelectedAmount(amount);
    };

    useEffect(() => {
        if (!isDonationWindowOpen) {
            setLocalSelectedAmount(10);
        }
    }, [isDonationWindowOpen]);

    const renderDonationContent = (card) => (
        <div className="button-container-popup">
            <button className="close-button" onClick={() => handleDonationWindowToggle(card.id)}>
                X
            </button>
            <div>
                <div>
                    <p>Select the amount to donate (THB)</p>
                </div>
                <div className="button-radio">
                    {[10, 20, 50, 100, 500].map((amount) => (
                        <label key={amount}>
                            <input
                                type="radio"
                                name={`payment-${card.id}`}
                                checked={localSelectedAmount === amount}
                                onChange={() => handleRadioChange(amount)}
                            />
                            {amount}
                        </label>
                    ))}
                </div>
                <div className="button-pay">
                    <button onClick={() => handleDonate(card.id, localSelectedAmount)}>Pay</button>
                </div>
            </div>
        </div>
    );

    const renderCard = (card) => (
        <div key={card.id} className={`card ${isDonationWindowOpen && selectedCharity === card.id ? 'selected' : ''}`}>
            <img src={`images/${card.image}`} alt={card.name} />
            {isDonationWindowOpen && selectedCharity === card.id
                ? renderDonationContent(card)
                : (
                    <div className="button-container">
                        <h3>{card.name}</h3>
                        <button onClick={() => handleDonationWindowToggle(card.id)}>Donate</button>
                    </div>
                )}
        </div>
    );

    return (
        <div className={`card-grid${isDonationWindowOpen ? ' donation-window' : ''}`}>
            {charities.map(renderCard)}
            {isDonationWindowOpen && <div className="overlay" onClick={handleDonationWindowToggle}></div>}
        </div>
    );
};

export default CardGrid;
