import React, { useEffect, useCallback, useState } from 'react';
import { DragPan } from 'ol/interaction';
import { useDispatch } from 'react-redux';
import { api } from 'axiosConfig';
import { Card } from 'primereact/card';

import { createBlankMap } from 'Mapping/Map';
import { setMap } from '../CardDrawingTools/redux/actions';
import './SavedCards.css';
import { useNavigate } from 'react-router-dom';
function SavedCards() {
	const dispatch = useDispatch();
	const [cards, setCards] = useState([]);
	const navigate = useNavigate();

	const handleUserChoice = useCallback(
		(cardID) => {
			navigate(`/production/carte/${cardID}`);
		},
		[navigate]
	);

	useEffect(() => {
		api
			.get('carteProduite/')
			.then((res) => {
				console.log(res.data);
				setCards(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
		createBlankMap('map-container').then((res) => {
			res.addInteraction(new DragPan());
			dispatch(setMap(res));
		});
	}, [dispatch]);
	return (
		<div className="saved_cards_page_content">
			<div className="saved_cards">
				{cards.map((card, key) => (
					<Card
						key={key}
						style={{ width: '25rem', marginBottom: '2em' }}
						onClick={() => handleUserChoice(card.idCarteProduite)}>
						<div style={{ pointerEvent: 'none' }}>
							Nom de la carte: {card.cartePredifini.nomCarte}
						</div>
						<div style={{ pointerEvent: 'none' }}>
							Date de validité: {card.dateValiditeCP}
						</div>
						<div style={{ pointerEvent: 'none' }}>
							Date de creation: {card.dateCreationCP}
						</div>
						<div style={{ pointerEvent: 'none' }}>
							Nom de la zone: {card.cartePredifini.zoneCarte.nomZone}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}

export default SavedCards;
