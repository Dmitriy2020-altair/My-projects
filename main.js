'use strict';

generateSlider(document.querySelector('.slider'), {
	pagination: true,
	arrows: true,
	autoplay: false,
	autoplayTime: 2000,
	showModal: true,
});

generateSlider(document.querySelector('.slider-two'), {
	pagination: true,
	arrows: false,
	autoplay: true,
	autoplayTime: 2000,
	showModal: true,
});

function generateSlider(container, {
	pagination: showPagination = true,
	arrows = true,
	autoplay = true,
	autoplayTime = 3000,
	showModal = true,
} = {}) {
	let currentIndex = 0;
	let pagination = null;
	let intervalId = null;
	const sliderItems = container.querySelectorAll('.slider-item');
	const sliderItemsCount = sliderItems.length;
	const slideWidth = container.clientWidth;
	const sliderTrack = document.createElement('div');
	sliderTrack.classList.add('slider-wrapper');
	const sliderTrackWidth = sliderItemsCount * slideWidth;
	sliderTrack.style.width = sliderTrackWidth + 'px';

	sliderItems.forEach(function (slideItem) {
		sliderTrack.append(slideItem);
	});
	container.append(sliderTrack);


	if (showPagination) {
		renderPagination();
	}

	if (arrows) {
		renderArrows();
	}
	if (showModal) {
		sliderTrack.addEventListener('click', getModal);
		function getModal(event) {
			const slide = event.target.closest('.slider-item');
			if (slide) {
				const modal = document.querySelector('.modal');
				const modalContent = modal.querySelector('.content');
				const slideClone = slide.cloneNode(true);
				
				modalContent.append(slideClone);

				modal.setAttribute('active', '');
			}
		}
	}

	runAutoplay();

	function runAutoplay() {
		if (!autoplay) return;
		clearInterval(intervalId);
		intervalId = setInterval(function () {
			goToSlide(currentIndex + 1);
		}, autoplayTime);
	}

	function goToSlide(index) {
		const newCurrentIndex = index < 0 ?
			sliderItemsCount - 1
			: index >= sliderItemsCount
				? 0
				: index;
		currentIndex = newCurrentIndex;
		sliderTrack.style.transform = `translateX(-${slideWidth * newCurrentIndex}px)`;

		runAutoplay();
		if (!showPagination) return;
		for (let i = 0; i < pagination.children.length; i++) {
			const element = pagination.children[i];
			if (i === currentIndex) {
				element.classList.add('active');
			} else {
				element.classList.remove('active');
			}

		}
	}

	function renderArrows() {
		const leftArrow = document.createElement('div');
		const rightArrow = document.createElement('div');
		leftArrow.className = 'slider-arrow prev-btn';
		rightArrow.className = 'slider-arrow next-btn';
		rightArrow.innerHTML = '>';
		leftArrow.innerHTML = '<';

		container.append(leftArrow);
		container.append(rightArrow);

		leftArrow.addEventListener('click', function () {
			goToSlide(currentIndex - 1);
		});

		rightArrow.addEventListener('click', function () {
			goToSlide(currentIndex + 1);
		})

	}

	function renderPagination() {
		pagination = document.createElement('div');
		pagination.className = 'pagination';

		for (let i = 0; i < sliderItemsCount; i++) {
			const paginationDot = document.createElement('div')
			paginationDot.className = 'pagination-dot';

			if (i === currentIndex) {
				paginationDot.classList.add('active');
			}

			paginationDot.setAttribute('data-index', i);
			pagination.append(paginationDot);

		}

		pagination.addEventListener('click', function (event) {
			const paginationDot = event.target.closest('.pagination-dot');

			if (paginationDot) {
				const newCurrentIndex = Number(paginationDot.getAttribute('data-index'));
				goToSlide(newCurrentIndex);
			}

		});

		container.append(pagination);

	}

}

// Modal
const modal = document.querySelector('.modal');

modal.addEventListener('click', closeModal);

function closeModal(event) {
	if (event.target.matches('.modal')) {
		modal.removeAttribute('active');
		const modalContent = modal.querySelector('.content');

		modalContent.innerHTML = '';
	}
}
