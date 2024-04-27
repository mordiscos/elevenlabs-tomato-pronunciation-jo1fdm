import { ElevenLabsClient } from "elevenlabs";
import fs from 'fs';

// Helper function to play audio (assuming an abstract function for demonstration)
async function play(audioResponse: any) {
    console.log("Playing audio:", audioResponse.url);
}

async function main() {
    const elevenLabs = new ElevenLabsClient({
        apiKey: "YOUR_API_KEY"
    });

    // Step 1: Create a pronunciation dictionary from a file
    const phonemeFile = fs.createReadStream("/path/to/your/phoneme-file.pls");
    const pronunciationDictionary = await elevenLabs.pronunciationDictionary.create({
        file: phonemeFile,
        request: {
            name: "TomatoPhonemes"
        }
    });

    console.log("Dictionary created with ID:", pronunciationDictionary.id);

    // Step 2: Generate and play audio using the pronunciation dictionary
    let generatedAudioResponse = await elevenLabs.generate({
        voice: "Rachel",
        model_id: "eleven_multilingual_v2",
        text: "tomato",
        pronunciation_dictionary_ids: [pronunciationDictionary.id]
    });

    await play(generatedAudioResponse);

    // Step 3: Remove the "tomato" rule from the pronunciation dictionary
    await elevenLabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary({
        pronunciationDictionaryId: pronunciationDictionary.id,
        request: {
            rule_strings: ["tomato", "Tomato"]
        }
    });

    console.log("Rules removed for 'tomato' and 'Tomato'");

    // Generate and play audio after removing rules
    generatedAudioResponse = await elevenLabs.generate({
        voice: "Rachel",
        model_id: "eleven_multilingual_v2",
        text: "tomato",
        pronunciation_dictionary_ids: [pronunciationDictionary.id]
    });

    await play(generatedAudioResponse);

    // Step 4: Add the "tomato" rule again using phoneme
    await elevenLabs.pronunciationDictionary.addRulesToThePronunciationDictionary({
        pronunciationDictionaryId: pronunciationDictionary.id,
        request: {
            rules: [{
                type: "phoneme",
                string_to_replace: "tomato",
                phoneme: "təˈmɑːtoʊ",
                alphabet: "IPA"
            }]
        }
    });

    console.log("Rule added again for 'tomato'");

    // Step 5: Generate and play audio again using the modified pronunciation dictionary
    generatedAudioResponse = await elevenLabs.generate({
        voice: "Rachel",
        model_id: "eleven_multilingual_v2",
        text: "tomato",
        pronunciation_dictionary_ids: [pronunciationDictionary.id]
    });

    await play(generatedAudioResponse);
}

main().catch(console.error);
