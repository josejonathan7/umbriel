import mongoose from "mongoose";
import { Readable } from 'stream';

import ImportContactService from '@services/importContactService';
import Contact from "@schemas/Contact";
import Tag from "@schemas/Tag";

describe("Import", () => {
    beforeAll(async () => {
        if(!process.env.MONGO_URL) {
            throw new Error ('MongoDb server not initialized!');
        }

        await mongoose.connect(process.env.MONGO_URL);
    });

    afterAll(async () => await mongoose.connection.close());

    beforeEach( async () => {
        await Contact.deleteMany({});
        await Tag.deleteMany({});
    });


    it("should be able to import new contacts", async () => {
        const contactFileStreams = Readable.from([
            'jonathan@gmail.com\n',
            'jose@rocketseat.com\n',
            'gomes@hootmail.com\n'
        ]);

        const importContacts = new ImportContactService();

        await importContacts.run(contactFileStreams, ['student', 'class a']);

        const createdTags = await Tag.find({}).lean();

        expect(createdTags).toEqual(expect.arrayContaining([
                expect.objectContaining({ title: 'student' }),
                expect.objectContaining({ title: 'class a' }),
            ]),
        );

        const createdTagsIds = createdTags.map(tag => tag._id);

        const createdContacts = await Contact.find({}).lean();

        expect(createdContacts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    email: 'jonathan@gmail.com',
                    tags: createdTagsIds
                }),
                expect.objectContaining({
                    email: 'jose@rocketseat.com',
                    tags: createdTagsIds
                }),
                expect.objectContaining({
                    email: 'gomes@hootmail.com',
                    tags: createdTagsIds
                }),
            ])
        );
    });

    it("Should not recreate tags that already exists", async () => {
        const contactFileStreams = Readable.from([
            'jonathan@gmail.com\n',
            'jose@rocketseat.com\n',
            'gomes@hootmail.com\n'
        ]);

        const importContacts = new ImportContactService();

        await Tag.create({ title: 'Student'});

        await importContacts.run(contactFileStreams, ['student', 'class a']);

        const createdTags = await Tag.find({}).lean();

        expect(createdTags).toEqual([
            expect.objectContaining({ title: 'student' }),
            expect.objectContaining({ title: 'class a' })
        ]);
    });

    it("Should not recreate contacts that already exists", async () => {
        const contactFileStreams = Readable.from([
            'jonathan@gmail.com\n',
            'jose@rocketseat.com\n',
            'gomes@hootmail.com\n'
        ]);

        const importContacts = new ImportContactService();

        const tag = await Tag.create({ title: 'Students' })
        await Contact.create({ email: 'jose@hotmail.com', tags: tag._id });

        await importContacts.run(contactFileStreams, ['class a']);

        const contacts = await Contact.find({ email: 'jose@hotmail.com' }).populate('tags').lean();

        expect(contacts.length).toBe(1);
        expect(contacts[0].tags).toEqual([
            expect.objectContaining({ title: 'Students'}),
            expect.objectContaining({ title: 'class a'}),
        ])

    });
})