import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class prepareXML{

	public static void main(String[] args){
		try{
			prepareFile("C:/Users/i076326/git/Analyzing-Twitter-Streams/miscellanous/chatwordpush/src/misc/dictionary_full.txt","C:/Users/i076326/git/Analyzing-Twitter-Streams/miscellanous/chatwordpush/src/views/preparedWordList.js");
		}catch(IOException e){
			System.out.println("Error:" + e.getMessage());
		}
	}

	public static void prepareFile(String fileloc1, String fileloc2) throws IOException{
		FileReader file = null;
		file = new FileReader(fileloc1);
		BufferedReader reader = new BufferedReader(file);
		String line = "";
		String finalresult = "exports.build = function(){\n\t\tvar htmlContent = '{\"results\" : ["; 
		while((line = reader.readLine())!=null){
			Integer count;
			Integer flag = 0;
			String name = "";
			String value = "";
			for(count=0;count<line.length();count++){
				if(line.charAt(count)=='\t'){
					if(flag==0){
						Integer removesp = count;
						for(;removesp<line.length();removesp++){
							if((line.charAt(removesp)!=' ')&&(line.charAt(removesp)!='\t'))
								break;
						}
						count = removesp;
					}
					flag = 1;
				}
				if(flag==0)
					name = name + line.charAt(count);
				else if(flag==1)
					value = value + line.charAt(count);
			}
			String result = "{\"result\":{\"name\":\"" + name + "\",\"value\":\"" + value + "\"}}";
			finalresult = finalresult + result + ",";
		}
		finalresult = finalresult + "]}';\n\t\treturn [htmlContent];\n}";
		FileWriter filew = null;
		filew = new FileWriter(fileloc2);
		BufferedWriter writer = new BufferedWriter(filew);
		writer.write(finalresult);
		writer.close();
	}
}