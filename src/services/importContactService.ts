import { Readable } from 'stream'
import {parse} from 'csv-parse';
import Contact from '@schemas/Contact';
import Tag from '@schemas/Tag';

class ImportContactService {

    async run(contactsFileStream: Readable, tags: string[]): Promise<void> {
        const parsers = parse({
            delimiter: ";"
        });

        const parseCSV = contactsFileStream.pipe(parsers);

        const existentTags = await Tag.find({
            titile: {
                $in: tags
            }
        });

        const existentTagsTitle = existentTags.map(tag => tag.title);

        const newTagsData = tags.filter(tag => !existentTagsTitle.includes(tag)).map(tag => ({
            title: tag
        }))   

        const createdTag = await Tag.create(newTagsData);
        const tagsIds = createdTag.map(tag => tag._id);
      
        parseCSV.on('data', async line => {
            const [email] = line;

            await Contact.findOneAndUpdate(
                { email },
                { $addToSet: {tags: tagsIds}},
                { upsert: true }
            )
        });

        await new Promise(resolve => parseCSV.on("end", resolve));
    }
}

export default ImportContactService;