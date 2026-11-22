
async function loadStory() {
  const content = document.getElementById("storyContent");

  if (!content) {
    console.error('Element with id "storyContent" was not found.');
    return;
  }

  try {
    // story.txt ফাইল থেকে গল্প লোড করবে
    const response = await fetch("./story.txt", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `story.txt could not be loaded (HTTP ${response.status})`
      );
    }

    const storyText = await response.text();

    // গল্পকে আলাদা আলাদা paragraph-এ ভাগ করবে
    const blocks = storyText.trim().split(/\r?\n\s*\r?\n/);

    content.replaceChildren();

    for (const block of blocks) {
      const lines = block
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

      if (lines.length === 0) continue;

      // কোনো অংশে শুধু - দিয়ে শুরু হওয়া লাইন থাকলে list তৈরি করবে
      if (lines.every(line => line.startsWith("- "))) {
        const list = document.createElement("ul");

        for (const line of lines) {
          const item = document.createElement("li");
          item.textContent = line.slice(2);
          list.appendChild(item);
        }

        content.appendChild(list);
      } else {
        // সাধারণ গল্পের paragraph তৈরি করবে
        const paragraph = document.createElement("p");
        paragraph.textContent = lines.join(" ");
        content.appendChild(paragraph);
      }
    }

  } catch (error) {
    console.error("Story loading error:", error);

    content.replaceChildren();

    const message = document.createElement("p");
    message.className = "loading";
    message.textContent =
      "গল্পটি লোড করা যায়নি। story.txt ফাইলটি index.html-এর একই ফোল্ডারে আছে কি না এবং ওয়েবসাইটটি সার্ভার থেকে চালানো হচ্ছে কি না পরীক্ষা করুন।";

    content.appendChild(message);
  }
}

// ওয়েবসাইট চালু হলে গল্প লোড হবে
loadStory();
