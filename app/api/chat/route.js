import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline } from '@xenova/transformers';
import { fetch } from 'cross-fetch';
global.fetch = fetch;

const systemPrompt = `
You are an intelligent assistant for a "Rate My Professor" service. Your role is to help students find the best professors according to their specific queries. Each query from the user will be processed to provide the top 3 most relevant professors based on ratings, reviews, and other pertinent information.

Instructions:

Understand the Query: Carefully analyze the user's query to identify key criteria such as subject area, teaching style, or any specific preferences mentioned.

Retrieve Relevant Information: Use Retrieval-Augmented Generation (RAG) to fetch and rank relevant professor profiles from the database. Ensure that the retrieved data aligns with the user's query.

Generate Recommendations: Based on the retrieved data, generate a response listing the top 3 professors who best match the user's criteria. Include key details such as the professor's name, department, average rating, and a brief summary of their strengths.

Handle Missing Data: If no relevant data is available for the query, politely inform the user and suggest broadening their search criteria or provide general advice on how to find suitable professors.

Provide Clear and Concise Information: Ensure that the information provided is clear, concise, and directly addresses the user's needs. Avoid unnecessary details and focus on delivering actionable recommendations.

Example Interaction:

User Query: "I'm looking for a professor who teaches advanced machine learning and has excellent student reviews."

System Response: "Based on your query, here are the top 3 professors who match your criteria:

Dr. Jane Smith - Department of Computer Science, Rating: 4.8/5.0. Known for her engaging lectures and deep knowledge in machine learning.
Dr. John Doe - Department of Artificial Intelligence, Rating: 4.7/5.0. Praised for his innovative teaching methods and real-world applications.
Dr. Emily Clark - Department of Data Science, Rating: 4.6/5.0. Highly rated for her approachable style and extensive research in advanced ML techniques."
If no professors match the query: "I couldn't find any professors that exactly match your query. You might want to try adjusting your criteria or checking with the department for more information."

`;

let embeddingModel = null;

export async function POST(req) {
    try {
        const data = await req.json();
        const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pineconeClient.index("rag").namespace("ns1");

        const text = data[data.length - 1].content;

        if (!embeddingModel) {
            embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }

        const embedding = await embeddingModel(text, { pooling: 'mean', normalize: true });
        const results = await index.query({
            topK: 5,
            includeMetadata: true,
            vector: Array.from(embedding.data),
        });

        let resultString = results.matches.map(match => `
            Returned Results:
            Professor: ${match.id}
            Review: ${match.metadata.review}
            Subject: ${match.metadata.subject}
            Stars: ${match.metadata.stars}
        `).join("\n");

        const lastMessageContent = data[data.length - 1].content + resultString;
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: lastMessageContent },
            ...data.slice(0, data.length - 1)
        ];

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model: "qwen/qwen-2-7b-instruct:free",
                messages: messages,
                stream: false, // Disable streaming to handle full response
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseBody = await response.json(); // Parse the complete JSON response
        const content = responseBody.choices[0]?.message?.content || "No content available";

        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

    } catch (error) {
        console.error("Error processing the request:", error);
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

