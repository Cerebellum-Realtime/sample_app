import { v4 as uuidv4 } from "uuid";
import { Channel } from "../models/channel";
import { Message } from "../models/message";
import { a } from "vitest/dist/suite-IbNSsUWN";
export class DB {
  async addChannel(channelName: string): Promise<string> {
    try {
      const existingChannel = await this.getChannel(channelName);

      if (existingChannel) {
        return existingChannel.channelId;
      } else {
        const newChannel = new Channel({
          channelId: uuidv4(),
          channelName: channelName,
        });

        await newChannel.save();
        return newChannel.channelId;
      }
    } catch (error) {
      console.error("Error adding channel:", error);
      throw error;
    }
  }

  async getChannel(channelName: string) {
    try {
      const channel = await Channel.query("channelName").eq(channelName).exec();
      return channel[0];
    } catch (error) {
      console.error("Error fetching channel:", error);
    }
  }

  async saveMessage(channelId: string, content: string) {
    try {
      const newMessage = new Message({
        messageId: uuidv4(), // Example: Generate a unique messageId
        channelId: channelId,
        content: content,
      });

      await newMessage.save();
      console.log("Message saved successfully");
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }

  async getMessagesForChannel(channelId: string) {
    try {
      const messages = await Message.query("channelId").eq(channelId).exec();

      const sortedMessages = messages.sort((a, b) => a.createdAt - b.createdAt);

      const contents = sortedMessages.map((message) => message.content);
      return contents;
    } catch (error) {
      console.error("Error retrieving messages for channel:", error);
      throw error;
    }
  }

  async scanTable(tableName: string) {
    try {
      const items = await Channel.scan().exec();

      const result = await items.populate();
      console.log("Scanned Items:", result);
      return items;
    } catch (error) {
      console.error("An error occurred scanning the table:", error);
      throw error;
    }
  }
}
