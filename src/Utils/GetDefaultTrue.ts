export default (value: boolean | null) => {
	switch (value) {
		case true:
			return true;
		case false:
			return false;
		default:
			return true;
	}
};
