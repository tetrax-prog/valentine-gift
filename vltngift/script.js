document.addEventListener('DOMContentLoaded', function() {
    const prizes = {
        regular: "A Beautiful Flower 🌸",
        grand: "The gift of knowledge 💎"
    };

    let gameState = {
        stage: 'first-choice',
        selectedBox: null,
        openedBoxes: [],
        grandPrizePosition: Math.floor(Math.random() * 3)
    };

    const toast = new bootstrap.Toast(document.getElementById('prizeToast'));
    const gameMessage = document.getElementById('gameMessage');
    const prizeDisplay = document.getElementById('prizeDisplay');
    const playAgainButton = document.getElementById('playAgain');
    const giftBoxes = document.querySelectorAll('.gift-box');

    function showToast(message,icon,title) {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,     
          });
    }

    const start = () => {
        setTimeout(function() {
            confetti.start()
        }, 1000); // 1000 is time that after 1 second start the confetti ( 1000 = 1 sec)
    };

    //  Stop

    const stop = () => {
        setTimeout(function() {
            confetti.stop()
        }, 20000); // 5000 is time that after 5 second stop the confetti ( 5000 = 5 sec)
    };


    function handleBoxClick(boxIndex) {
        if (gameState.openedBoxes.includes(boxIndex) || 
            (gameState.stage === 'second-choice' && gameState.selectedBox === boxIndex) ||
            gameState.stage === 'final') {
            return;
        }

        const isGrandPrize = boxIndex === gameState.grandPrizePosition;
        var currentPrize = isGrandPrize ? prizes.grand : prizes.regular;

        if (gameState.stage === 'first-choice') {
            var currentPrize = prizes.regular;
            gameState.selectedBox = boxIndex;
            gameState.openedBoxes.push(boxIndex);
            giftBoxes[boxIndex].classList.add('opened');
            
            showToast(`You got: beautiful flower and maybe a gift of your choosing.\n The odds of you winning the grand prize is 2/3 if you choose another box but you will loose this gift. Would you like to keep this prize or try another box?`, "info", "You won a beautiful a flower");
            gameMessage.textContent = 'You can keep your prize or try another box';
            gameState.stage = 'second-choice';

        } else if (gameState.stage === 'second-choice') {
            gameState.openedBoxes.push(boxIndex);
            giftBoxes[boxIndex].classList.add('opened');
            
            const gift = isGrandPrize ? (
                Swal.fire({
                    icon: "success",
                    title: "Congrats. You won the grand prize 💎",
                    text: "You got something better than flowers and chocolate. You got the gift of knowledge. You get to see and learn how this program works",
                    footer: "<a href='https://github.com/tetrax-prog/valentine-gift.git' target='_blank'>Link to code's repository</a>"
                }),
                start(),
                stop()
            ) : (
                Swal.fire({
                    icon: "info",
                    title: "Gift remains a flower",
                    text: "The grand prize was in the other box but your gift remains a flower or a box of chocolates or a trip to the mall or maybe all three of them",
                })
            );
            
            gameMessage.textContent = 'Game Over!';
            gameState.stage = 'final';
            playAgainButton.style.display = 'block';
            
        }

        // Show prize text under the opened box
        const prizeText = document.createElement('div');
        prizeText.className = 'prize-text';
        prizeText.textContent = currentPrize;
        giftBoxes[boxIndex].appendChild(prizeText);

        // Disable appropriate boxes
        updateBoxStates();
    }

    function updateBoxStates() {
        giftBoxes.forEach((box, index) => {
            if (gameState.openedBoxes.includes(index) ||
                (gameState.stage === 'second-choice' && gameState.selectedBox === index) ||
                gameState.stage === 'final') {
                box.classList.add('disabled');
            }
        });
    }

    function resetGame() {
        gameState = {
            stage: 'first-choice',
            selectedBox: null,
            openedBoxes: [],
            grandPrizePosition: Math.floor(Math.random() * 3)
        };

        gameMessage.textContent = 'Pick a box to reveal your prize';
        playAgainButton.style.display = 'none';
        
        giftBoxes.forEach(box => {
            box.className = 'gift-box';
            const prizeText = box.querySelector('.prize-text');
            if (prizeText) {
                box.removeChild(prizeText);
            }
        });
    }

    // Event Listeners
    giftBoxes.forEach((box, index) => {
        box.addEventListener('click', () => handleBoxClick(index));
    });

    playAgainButton.addEventListener('click', resetGame);
});
