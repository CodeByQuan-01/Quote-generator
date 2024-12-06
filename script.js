const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteButton = document.getElementById('new-quote');
const tweetQuoteLink = document.getElementById('tweet-quote');

// Using the API Ninjas Quotes API
const API_URL = 'https://api.api-ninjas.com/v1/quotes?category=success';
const API_KEY = 'mYhVVidViDtRXuXAJcHbXg==t8lc9RaKyniorG8B'; // Replace with your actual API key

async function getQuote() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('API Error:', error);
        return {
            quote: "Getting a quality website is not an EXPENSE BUT RATHER AN INVESTMENT.",
            author: "Dr. Christopher Dayagdag"
        };
    }
}

async function fetchNewQuote() {
    newQuoteButton.disabled = true;
    tweetQuoteLink.classList.add('pointer-events-none', 'opacity-50');
    
    // Fade out current quote
    quoteElement.classList.add('opacity-0');
    authorElement.classList.add('opacity-0');
    
    setTimeout(async () => {
        quoteElement.textContent = 'Loading...';
        authorElement.textContent = '';
        
        try {
            const quote = await getQuote();
            if (quote) {
                // Split long quotes into multiple lines for better readability
                const words = quote.quote.split(' ');
                const lines = [];
                let currentLine = [];
                
                words.forEach(word => {
                    if (currentLine.join(' ').length + word.length > 40) {
                        lines.push(currentLine.join(' '));
                        currentLine = [word];
                    } else {
                        currentLine.push(word);
                    }
                });
                if (currentLine.length > 0) {
                    lines.push(currentLine.join(' '));
                }
                
                displayQuote({
                    quote: lines.join('\n'),
                    author: quote.author
                });
            } else {
                throw new Error('Failed to fetch quote');
            }
        } catch (error) {
            console.error('Error:', error);
            quoteElement.textContent = 'Failed to fetch quote. Please try again.';
            authorElement.textContent = '';
        } finally {
            newQuoteButton.disabled = false;
            tweetQuoteLink.classList.remove('pointer-events-none', 'opacity-50');
            
            // Fade in new quote
            quoteElement.classList.remove('opacity-0');
            authorElement.classList.remove('opacity-0');
        }
    }, 300);
}

function displayQuote(quote) {
    quoteElement.innerHTML = quote.quote.split('\n').join('<br>');
    authorElement.textContent = `- ${quote.author}`;
    updateTweetLink(quote);
}

function updateTweetLink(quote) {
    const tweetText = encodeURIComponent(`"${quote.quote.replace(/\n/g, ' ')}" - ${quote.author}`);
    tweetQuoteLink.href = `https://twitter.com/intent/tweet?text=${tweetText}`;
}

newQuoteButton.addEventListener('click', fetchNewQuote);

// Load initial quote when page loads
fetchNewQuote();