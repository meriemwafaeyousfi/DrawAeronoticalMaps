import React, { useState, useCallback, useEffect } from 'react';
import { Card } from 'primereact/card';
import { api } from 'axiosConfig';
import './NewCard.css';
import { useNavigate } from 'react-router-dom';

function NewCard() {
	const navigate = useNavigate();
	const [cards, setCards] = useState([]);

	const handleUserChoice = useCallback(
		(cardID) => {
			console.log(cardID);
			api
				.post('carteProduite/', { cartePredifini: cardID })
				.then((res) => {
					console.log(res);
					navigate(`/production/carte/${res.data.idCarteProduite}`);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[navigate]
	);
	useEffect(() => {
		api
			.get('carte/')
			.then((res) => {
				console.log(res.data);
				setCards(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<div className="saved_cards_page_content">
			<div className="saved_cards">
				{cards.map((card, key) => (
					<Card
						key={key}
						style={{ width: '25rem', marginBottom: '2em' }}
						onClick={() => handleUserChoice(card.idCarte)}>
						<div style={{ pointerEvent: 'none' }}>
							Nom de la carte: {card.nomCarte}
						</div>
						<div style={{ pointerEvent: 'none' }}>
							Nom de la zone: {card.zoneCarte.nomZone}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

export default NewCard;
