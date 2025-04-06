function updateLineNumbers() {
    const textarea = document.getElementById("code-input");
    const lines = textarea.value.split("\n").length;
    const numbers = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    document.getElementById("line-numbers").textContent = numbers;
}

window.addEventListener("load", updateLineNumbers);

function RemoveComments() {
    const code = codeInput.value;

    let stringLiterals = [];
    let codeWithPlaceholders = code.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, function(match) {
        let placeholder = `___STRING_LITERAL_${stringLiterals.length}___`;
        stringLiterals.push(match);
        return placeholder;
    });

    let codeWithoutMultiLine = codeWithPlaceholders.replace(/\/\*[\s\S]*?\*\//g, ''); 

    const lines = codeWithoutMultiLine.split('\n');

    const processedLines = lines.map(line => {

        const slashIndex = line.indexOf('//');
        
        if (slashIndex !== -1) {

            const beforeSlash = slashIndex === 0 ? '' : line.charAt(slashIndex - 1);
            if (beforeSlash === '' || beforeSlash === ' ' || beforeSlash === '\t') {
                return line.substring(0, slashIndex).trimEnd();
            }
        }

        return line;
    });

    let finalCode = processedLines
        .filter(line => line !== null)
        .join('\n');

    finalCode = finalCode.replace(/\n\s*\n\s*\n+/g, '\n\n');

    stringLiterals.forEach((str, index) => {
        finalCode = finalCode.replace(`___STRING_LITERAL_${index}___`, str);
    });

    codeInput.value = finalCode;
    
    navigator.clipboard.writeText(finalCode)
        .then(() => {
            console.log('Код успешно скопирован в буфер обмена');
        })
        .catch(err => {
            console.error('Ошибка при копировании: ', err);
        });

    updateLineNumbers();
    handleButtonAnimation();
}

function handleButtonAnimation() {
    const button = document.getElementById("result-btn");
    if (button) {
        button.classList.add("clicked");
        setTimeout(() => {
            button.classList.remove("clicked");
        }, 300);
    }
}

function updateLineNumbers() {
    const textarea = document.getElementById("code-input");
    if (!textarea) return;
    const lines = textarea.value.split("\n").length;
    const numbers = Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1).join("\n");
    const lineNumbersDiv = document.getElementById("line-numbers");
    if (lineNumbersDiv) {
       lineNumbersDiv.textContent = numbers;
    }
}

function syncScroll() {
    const textarea = document.getElementById("code-input");
    const lineNumbers = document.getElementById("line-numbers");
    if (textarea && lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
}

window.addEventListener("load", updateLineNumbers);

const codeInput = document.getElementById("code-input");
const resultButton = document.getElementById("result-btn");

if (resultButton && codeInput) {
    resultButton.addEventListener("click", RemoveComments);
}

if (codeInput) {
    codeInput.addEventListener('input', () => {
        updateLineNumbers();
        syncScroll();
    });
    codeInput.addEventListener('scroll', syncScroll);
}

updateLineNumbers();