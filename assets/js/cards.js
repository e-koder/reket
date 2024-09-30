// Converts vh units to pixels based on the window's inner height
const vhToPx = (value) => value * window.innerHeight / 100;

// Class representing a stack of cards with scrolling interaction
class CardStack {
	constructor(container) {
		this.container = container;
		this.totalCards = parseInt(getComputedStyle(container).getPropertyValue('--cards'));
		this.currentIndex = 1;
		this.setSizes();
		this.setActive(1);
	}

	setSizes() {
		const { container } = this;
		this.spacingVh = parseFloat(getComputedStyle(container).getPropertyValue('--space'));
		this.cardHeightVh = parseFloat(getComputedStyle(container).getPropertyValue('--card-height'));
		this.spacing = vhToPx(this.spacingVh);
		this.cardSize = vhToPx(this.cardHeightVh);
		this.emptySpaceSize = (window.innerHeight - this.cardSize);
	}

	// Set the active card based on the index
	setActive(index) {
		const activeElement = this.container.querySelector('.cards-stack-item.active');
		const nextActiveElement = this.container.querySelector(`.cards-stack-item[data-index="${index}"]`);
		
		if (activeElement !== nextActiveElement) {
			activeElement?.classList.remove('active');
			nextActiveElement?.classList.add('active');
			this.currentIndex = index;
		}
	}

	setActiveInContainer() {
		const topY = this.container.getBoundingClientRect().top
		let activeIndex = Math.floor((-topY + this.emptySpaceSize) / this.spacing);

		// Ensure the active index is within valid bounds
		activeIndex = Math.max(1, Math.min(activeIndex, this.totalCards));

		this.setActive(activeIndex);
	}

	// Get the top position of the container relative to the viewport
	get top() {
		return this.container.getBoundingClientRect().top;
	}
}

// Initializes the card stacks and adds scroll interaction
const initCardStacks = () => {
	const containers = [];
	const totalCards = 12;
	let lastKnownScrollPosition = 0;

	// Find all card stack containers and initialize them
	document.querySelectorAll('.cards-stack').forEach(container => {
		containers.push(new CardStack(container));
	});

	// Handle scroll event
	const handleScroll = () => {
		lastKnownScrollPosition = window.scrollY;
		
		containers.forEach(item => {
			item.setActiveInContainer(item);
		});
	};

	// Attach scroll listener
	document.addEventListener('scroll', handleScroll);
};

// Immediately invoke the function to initialize card stacks
initCardStacks();