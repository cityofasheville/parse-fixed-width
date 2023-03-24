# Parse Fixed Width
## Some of the files we send to vendors are fixed width files. This is a script to parse them back to csv so they can be imported into spreadsheets.

To set up a new one, you need the column widths in the variable:
    
    let widths = [6,7]

And column headers:

    fileOut.write("carrierId,clientID"]

And which column indexes are dates:

    let dates = [8,9,14,15];